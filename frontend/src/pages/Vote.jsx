import { useEffect, useState, useMemo, useRef } from 'react';
import { useProvince } from '../context/ProvinceContext';
import { useLoading } from '../context/LoadingContext';
import { candidateService, statusService } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { submitVote, resetVoteStatus } from '../userSlice';
import logger from '../utils/logger';
import { DISABLE_LOADING } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../utils/config';
import SuccessModal from '../components/SuccessModal';

function Vote() {
  const { selectedVoteProvince, setSelectedVoteProvince } = useProvince();
  const { showProvinceChangeLoading, hideLoading } = useLoading();
  const dispatch = useDispatch();
  const { loading: submitting, error: submitError, voteStatus } = useSelector((state) => state.user);
  
  // Track if we're currently loading due to a province change
  const loadingFromProvinceChange = useRef(false);
  
  // Add isFirstLoad state at component level
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // State to track selected candidates and loading states
  const [selectedSenators, setSelectedSenators] = useState([]);
  const [selectedPartyList, setSelectedPartyList] = useState(null);
  const [selectedGovernor, setSelectedGovernor] = useState(null);
  
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  
  // State for storing candidate data
  const [senators, setSenators] = useState([]);
  const [partyLists, setPartyLists] = useState([]);
  const [governors, setGovernors] = useState([]);
  
  // Loading states
  const [loadingSenators, setLoadingSenators] = useState(false);
  const [loadingPartyLists, setLoadingPartyLists] = useState(false);
  const [loadingGovernors, setLoadingGovernors] = useState(false);
  
  // Error states
  const [senatorsError, setSenatorsError] = useState(null);
  const [partyListsError, setPartyListsError] = useState(null);
  const [governorsError, setGovernorsError] = useState(null);
  
  // User information state
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    age: '',
    sex: 'male',
    email: ''
  });
  
  // Track previous province selection to detect changes
  // Initialize with current value to prevent initial loading effect
  const [previousProvince, setPreviousProvince] = useState(selectedVoteProvince);
  
  // Add new states for voting status
  const navigate = useNavigate();
  const [votingOpen, setVotingOpen] = useState(true); // Default to open until checked
  const [checkingVotingStatus, setCheckingVotingStatus] = useState(true);
  
  // Add state to track modal closing animation
  const [isClosing, setIsClosing] = useState(false);
  
  // Add state for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Effect to update document title
  useEffect(() => {
    // Save the original title
    const originalTitle = document.title;
    
    // Set page title to "Vote Now"
    document.title = "Vote Now";
    
    // Restore original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, []);
  
  // Initialize component on first mount
  useEffect(() => {
    // This ensures we don't show loading the first time
    setPreviousProvince(selectedVoteProvince);
    logger.debug('Vote page: initial mount');
    setIsFirstLoad(false);
  }, []);
  
  // Effect to detect and handle province changes and fetch candidates data
  useEffect(() => {
    // Don't do anything on component mount/first load
    if (isFirstLoad) {
      return;
    }
    
    // Function to fetch senators
    const fetchSenators = async () => {
      setLoadingSenators(true);
      setSenatorsError(null);
      logger.debug('Fetching senators data');
      
      try {
        const response = await candidateService.getSenators();
        setSenators(response.data || []);
      } catch (error) {
        logger.error('Error fetching senators:', error);
        setSenatorsError('Failed to load senators data. Please try again.');
      } finally {
        setLoadingSenators(false);
      }
    };
    
    // Function to fetch party lists
    const fetchPartyLists = async () => {
      setLoadingPartyLists(true);
      setPartyListsError(null);
      logger.debug('Fetching party lists data');
      
      try {
        const response = await candidateService.getPartyLists();
        setPartyLists(response.data || []);
      } catch (error) {
        logger.error('Error fetching party lists:', error);
        setPartyListsError('Failed to load party lists data. Please try again.');
      } finally {
        setLoadingPartyLists(false);
      }
    };
    
    // Function to fetch governors for the selected province
    const fetchGovernors = async (provinceCode) => {
      setLoadingGovernors(true);
      setGovernorsError(null);
      
      logger.debug(`Fetching governors data for province: ${provinceCode}`);
      
      try {
        const response = await candidateService.getGovernors(provinceCode);
        setGovernors(response.data || []);
      } catch (error) {
        logger.error('Error fetching governors:', error);
        setGovernorsError('Failed to load governors data. Please try again.');
      } finally {
        setLoadingGovernors(false);
      }
    };
    
    // Only show loading when user selects a different province with a valid value
    if (selectedVoteProvince && selectedVoteProvince !== previousProvince) {
      logger.info(`Province changed from ${previousProvince || 'none'} to ${selectedVoteProvince}`);
      
      // Remember new province before showing loading
      setPreviousProvince(selectedVoteProvince);
      
      // Only show loading if debugging is not disabled
      if (!DISABLE_LOADING) {
        // Mark that we're loading from a province change
        loadingFromProvinceChange.current = true;
        
        // Start the loading screen
        showProvinceChangeLoading(5000); // Use a longer timeout as safety
      }
      
      // Fetch all candidate data
      Promise.all([fetchSenators(), fetchPartyLists(), fetchGovernors(selectedVoteProvince)])
        .finally(() => {
          // Make sure any lingering loading is cleared
          if (loadingFromProvinceChange.current) {
            hideLoading();
            loadingFromProvinceChange.current = false;
          }
        });
      
    } else if (selectedVoteProvince !== previousProvince) {
      // If province was cleared or changed to empty, just update tracking without loading
      setPreviousProvince(selectedVoteProvince);
      
      // Clear governors when province is deselected
      setGovernors([]);
    }
  }, [selectedVoteProvince, previousProvince, isFirstLoad, showProvinceChangeLoading, hideLoading, DISABLE_LOADING]);
  
  // Function to handle user info changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Function to handle senator selection (can select up to 12)
  const handleSenatorSelect = (id) => {
    setSelectedSenators(prev => {
      // If already selected, remove it
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      // If not selected and less than 12 selected, add it
      else if (prev.length < 12) {
        return [...prev, id];
      }
      // If already 12 selected, don't add more
      return prev;
    });
  };
  
  // Function to handle party list selection (can select only 1)
  const handlePartyListSelect = (id) => {
    setSelectedPartyList(prev => prev === id ? null : id);
  };
  
  // Function to handle governor selection (can select only 1)
  const handleGovernorSelect = (id) => {
    setSelectedGovernor(prev => prev === id ? null : id);
  };
  
  // Function to open modal
  const openModal = () => {
    setIsClosing(false);
    setShowModal(true);
  };
  
  // Function to close modal with animation
  const closeModal = () => {
    setIsClosing(true);
    
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      
      // Clear submission message when closing the modal
      if (voteStatus) {
        dispatch(resetVoteStatus());
        setSubmissionMessage(null);
      }
    }, 300); // Match the animation duration (0.3s)
  };
  
  // Function to find senator by ID
  const findSenatorById = (id) => {
    // First find the senator from the sorted array
    return sortedSenators.find(senator => senator.id === id);
  };
  
  // Function to find party list by ID
  const findPartyListById = (id) => {
    // First find the party list from the sorted array
    return sortedPartyLists.find(partyList => partyList.id === id);
  };
  
  // Function to find governor by ID
  const findGovernorById = (id) => {
    // First find the governor from the sorted array
    return sortedGovernors.find(governor => governor.id === id);
  };
  
  // Function to validate form
  const validateForm = () => {
    // Validate user info fields
    if (!userInfo.firstName.trim()) return 'First name is required';
    if (!userInfo.lastName.trim()) return 'Last name is required';
    if (!userInfo.mobile.trim()) return 'Mobile number is required';
    if (!/^0[0-9]{10}$/.test(userInfo.mobile.trim())) return 'Mobile number must be 11 digits starting with 0';
    if (!userInfo.age.trim() || isNaN(userInfo.age)) return 'Age must be a valid number';
    if (parseInt(userInfo.age) < 18) return 'must be 18+ to vote';
    if (!userInfo.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email.trim())) return 'Please enter a valid email address';
    
    // Validate that at least one candidate is selected
    const hasSelectedSenator = selectedSenators.length > 0;
    const hasSelectedPartyList = !!selectedPartyList;
    const hasSelectedGovernor = !!selectedGovernor;
    
    if (!hasSelectedSenator && !hasSelectedPartyList && !hasSelectedGovernor) {
      return 'Please select at least one candidate (senator, party list, or governor)';
    }
    
    // Validate specific selections
    if (hasSelectedSenator && selectedSenators.length > 12) {
      return 'You can only select up to 12 senators';
    }
    
    return null;
  };
  
  // Function to handle final vote submission
  const handleVoteSubmit = () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setSubmissionMessage({
        type: 'error',
        text: validationError
      });
      return;
    }
    
    logger.info('Submitting vote data');
    
    // Prepare vote data
    const voteData = {
      userInfo: {
        firstName: userInfo.firstName.trim(),
        lastName: userInfo.lastName.trim(),
        mobileNumber: userInfo.mobile.trim(),
        age: parseInt(userInfo.age),
        sex: userInfo.sex,
        email: userInfo.email.trim(),
        provinceCode: selectedVoteProvince
      },
      votes: {}
    };
    
    // Only include selected votes to prevent null values
    if (selectedSenators.length > 0) {
      voteData.votes.senators = selectedSenators;
    }
    
    if (selectedPartyList) {
      voteData.votes.partyList = selectedPartyList;
    }
    
    if (selectedGovernor) {
      voteData.votes.governor = selectedGovernor;
    }
    
    // Dispatch vote submission action
    dispatch(submitVote(voteData));
  };

  // Reset submission message when modal is opened
  useEffect(() => {
    if (showModal) {
      setSubmissionMessage(null);
    }
  }, [showModal]);

  // Handle vote status changes
  useEffect(() => {
    if (voteStatus) {
      // Reset selections after successful submission
      setSelectedSenators([]);
      setSelectedPartyList(null);
      setSelectedGovernor(null);
      
      // Close form modal
      closeModal();
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset vote status after showing success
      setTimeout(() => {
        dispatch(resetVoteStatus());
      }, 500);
    }
  }, [voteStatus, dispatch]);

  // Handle submission error
  useEffect(() => {
    if (submitError) {
      // Check for specific "you already voted" error message
      if (typeof submitError === 'string' && submitError.toLowerCase().includes('already voted')) {
        setSubmissionMessage({
          type: 'error',
          text: 'You already voted'
        });
      } else {
        setSubmissionMessage({
          type: 'error',
          text: typeof submitError === 'string' ? submitError : 'Failed to submit your vote. Please try again.'
        });
      }
    }
  }, [submitError]);
  
  // Sort candidates by ballot_no
  const sortedSenators = useMemo(() => {
    return [...senators].sort((a, b) => {
      // Ensure ballot_no is treated as a number for comparison
      const ballotA = parseInt(a.ballot_no, 10) || 0;
      const ballotB = parseInt(b.ballot_no, 10) || 0;
      return ballotA - ballotB;
    });
  }, [senators]);
  
  const sortedPartyLists = useMemo(() => {
    return [...partyLists].sort((a, b) => {
      const ballotA = parseInt(a.ballot_no, 10) || 0;
      const ballotB = parseInt(b.ballot_no, 10) || 0;
      return ballotA - ballotB;
    });
  }, [partyLists]);
  
  const sortedGovernors = useMemo(() => {
    return [...governors].sort((a, b) => {
      const ballotA = parseInt(a.ballot_no, 10) || 0;
      const ballotB = parseInt(b.ballot_no, 10) || 0;
      return ballotA - ballotB;
    });
  }, [governors]);
  
  // Get sorted list of selected senators
  const sortedSelectedSenators = useMemo(() => {
    // Get the actual senator objects for selected IDs
    const selectedSenatorObjects = selectedSenators
      .map(id => sortedSenators.find(senator => senator.id === id))
      .filter(Boolean); // Remove any undefined values
    
    // Sort them by ballot number
    return selectedSenatorObjects.sort((a, b) => {
      const ballotA = parseInt(a.ballot_no, 10) || 0;
      const ballotB = parseInt(b.ballot_no, 10) || 0;
      return ballotA - ballotB;
    });
  }, [selectedSenators, sortedSenators]);

  // Add effect to check if voting is open
  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        setCheckingVotingStatus(true);
        const response = await statusService.getVotingStatus();
        
        if (!response.data.isVotingOpen) {
          logger.info('Voting is closed, redirecting to home');
          setVotingOpen(false);
          
          // Redirect after a short delay to show message
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        } else {
          setVotingOpen(true);
        }
      } catch (error) {
        logger.error('Error checking voting status:', error);
        // Default to closed if there's an error
        setVotingOpen(false);
      } finally {
        setCheckingVotingStatus(false);
      }
    };
    
    checkVotingStatus();
  }, [navigate]);
  
  // Show loading or closed message
  if (checkingVotingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom-gray">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Checking voting status...</h2>
          <p className="text-gray-600">Please wait while we verify if voting is currently open.</p>
        </div>
      </div>
    );
  }
  
  if (!votingOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom-gray">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Voting is Closed</h2>
          <p className="text-gray-600 mb-4">Thank you for your interest, but voting has been closed.</p>
          <p className="text-gray-600">You will be redirected to the home page shortly...</p>
        </div>
      </div>
    );
  }

  // Define a loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <>
        {!selectedVoteProvince ? (
          <div className="bg-custom-gray min-h-screen">
            <div className="container max-w-5xl px-4 py-8 mx-auto">
              <div className="bg-white p-6 rounded-md mb-6">
                <h1 className="font-extrabold text-lg">Online Voting Rules</h1>
                <h3 className="mt-4">1. Voters must be 18+ and registered in the Bicol Region.</h3>
                <h3 className="mt-4">2. All submitted information must be truthful.</h3>
                <h3 className="mt-4">3. A maximum of 3 votes per day per public IP address.</h3>
                <h3 className="mt-4">4. Votes cannot be changed or revoked once submitted.</h3>
                <p className="italic mt-6">
                  By voting, you agree to follow these rules and maintain fairness in the process.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <section className="bg-custom-gray">
            <div className="container max-w-5xl mx-auto px-4 py-8 flex flex-col">
                {/* SENATORS */}
                <div className="flex flex-col">
                  <div className="bg-dark-blue rounded-md flex flex-col h-18 justify-center px-5">
                    <p className="text-white text-xs">National</p>
                    <h3 className="text-white font-bold leading-4 text-lg">SENATOR</h3>
                  </div>
                  <p className="text-white bg-custom-red py-2 px-4 rounded-md my-1">Vote for 12 candidates</p>
                  
                  {loadingSenators ? (
                    <div className="bg-white p-6 rounded-md text-center">
                      <p>Loading senators...</p>
                    </div>
                  ) : senatorsError ? (
                    <div className="bg-white p-6 rounded-md text-center text-red-600">
                      <p>{senatorsError}</p>
                    </div>
                  ) : senators.length === 0 ? (
                    <div className="bg-white p-6 rounded-md text-center">
                      <p>No senators available</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-1">
                      {sortedSenators.map((senator) => (
                        <button 
                          key={senator.id} 
                          className={`bg-white flex items-center gap-4 px-4 min-h-14 text-sm rounded-md cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out ${selectedSenators.includes(senator.id) ? 'border border-custom-green/50' : 'border-custom-green/50'}`}
                          onClick={() => handleSenatorSelect(senator.id)}
                        >
                          <div className="flex-1 font-bold text-left">
                            {senator.ballot_no}. {senator.name}
                            <span className="font-normal text-gray-400">
                              {senator.party ? ` (${senator.party_code || senator.party})` : ''}
                            </span>
                          </div>
                          <span className={`rounded-full w-6 aspect-square border flex items-center justify-center ${selectedSenators.includes(senator.id) ? 'bg-custom-green text-white border-custom-green' : 'text-white border-gray-200'}`}>
                            {selectedSenators.includes(senator.id) && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PARTY LISTS */}
                <div className="flex flex-col mt-4">
                  <div className="bg-dark-blue rounded-md flex flex-col h-18 justify-center px-5">
                    <p className="text-white text-xs">National</p>
                    <h3 className="text-white font-bold leading-4 text-lg">PARTY LIST</h3>
                  </div>
                  <p className="text-white bg-custom-red py-2 px-4 rounded-md my-1">Vote for 1 candidate</p>
                  
                  {loadingPartyLists ? (
                    <div className="bg-white p-6 rounded-md text-center">
                      <p>Loading party lists...</p>
                    </div>
                  ) : partyListsError ? (
                    <div className="bg-white p-6 rounded-md text-center text-red-600">
                      <p>{partyListsError}</p>
                    </div>
                  ) : partyLists.length === 0 ? (
                    <div className="bg-white p-6 rounded-md text-center">
                      <p>No party lists available</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-1">
                      {sortedPartyLists.map((partyList) => (
                        <button 
                          key={partyList.id} 
                          className={`bg-white flex items-center gap-4 px-4 min-h-14 text-sm rounded-md cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out ${selectedPartyList === partyList.id ? 'border border-custom-green' : 'border-custom-green/50'}`}
                          onClick={() => handlePartyListSelect(partyList.id)}
                        >
                          <div className="flex-1 font-bold text-left">
                            {partyList.ballot_no}. {partyList.name}
                          </div>
                          <span className={`rounded-full w-6 aspect-square border flex items-center justify-center ${selectedPartyList === partyList.id ? 'bg-custom-green text-white border-custom-green' : 'text-white border-gray-200'}`}>
                            {selectedPartyList === partyList.id && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* GOVERNORS */}
                <div className="grid mt-4">
                  <div className="flex flex-col">
                    <div className="bg-dark-blue rounded-md flex flex-col h-18 justify-center px-5">
                      <p className="text-white text-xs">Provincial</p>
                      <h3 className="text-white font-bold leading-4 text-lg">GOVERNOR</h3>
                    </div>
                    <p className="text-white bg-custom-red py-2 px-4 rounded-md my-1">Vote for 1 candidate</p>
                    
                    {loadingGovernors ? (
                      <div className="bg-white p-6 rounded-md text-center">
                        <p>Loading governors...</p>
                      </div>
                    ) : governorsError ? (
                      <div className="bg-white p-6 rounded-md text-center text-red-600">
                        <p>{governorsError}</p>
                      </div>
                    ) : governors.length === 0 ? (
                      <div className="bg-white p-6 rounded-md text-center">
                        <p>No governors found for this province</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-1 gap-1">
                        {sortedGovernors.map((governor) => (
                          <button 
                            key={governor.id} 
                            className={`bg-white flex items-center gap-4 px-4 min-h-14 text-sm rounded-md cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out ${selectedGovernor === governor.id ? 'border border-custom-green' : 'border-custom-green/50'}`}
                            onClick={() => handleGovernorSelect(governor.id)}
                          >
                            <div className="flex-1 font-bold text-left">
                              {governor.ballot_no}. {governor.name}
                              <span className="font-normal text-gray-400">
                                {governor.party ? ` (${governor.party_code || governor.party})` : ''}
                              </span>
                            </div>
                            <span className={`rounded-full w-6 aspect-square border flex items-center justify-center ${selectedGovernor === governor.id ? 'bg-custom-green text-white border-custom-green' : 'text-white border-gray-200'}`}>
                              {selectedGovernor === governor.id && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={openModal}
                  disabled={!selectedVoteProvince || (selectedSenators.length === 0 && !selectedPartyList && !selectedGovernor)}
                  className={`${
                    !selectedVoteProvince || (selectedSenators.length === 0 && !selectedPartyList && !selectedGovernor)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-custom-green cursor-pointer hover:bg-custom-green/90 transition-colors'
                  } text-white px-16 h-10 rounded-md text-sm self-center mt-8`}
                >
                  Submit
                </button>
            </div>
          </section>
        )}
        
        {/* Vote Submission Modal */}
        {showModal && (
          <div 
            className="bg-black/85 fixed inset-0 overflow-scroll z-50" 
            role="dialog" 
            tabIndex="0"
            onClick={closeModal}
          >
            <div className="flex justify-center items-center h-full w-screen px-8 py-8">
              <div 
                className={`bg-white rounded-lg px-8 py-6 max-w-xl flex flex-col max-h-full overflow-y-auto my-8 ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-extrabold text-lg text-center md:text-xl text-custom-blue leading-5">SUBMIT YOUR VOTE</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400">Senator</p>
                      <div className="grid">
                        {/* Use sorted list of selected senators */}
                        {sortedSelectedSenators.map(senator => (
                          <p key={senator.id} className="font-semibold">
                            {senator.ballot_no}. {senator.name} 
                            <span className="font-normal text-gray-400">
                              {senator.party ? ` (${senator.party_code || senator.party})` : ''}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400">Party-List</p>
                      {selectedPartyList && findPartyListById(selectedPartyList) ? (
                        <p className="font-semibold">
                          {findPartyListById(selectedPartyList).ballot_no}. {findPartyListById(selectedPartyList).name}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">No party list selected</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Governor</p>
                      {selectedGovernor && findGovernorById(selectedGovernor) ? (
                        <p className="font-semibold">
                          {findGovernorById(selectedGovernor).ballot_no}. {findGovernorById(selectedGovernor).name}
                          <span className="font-normal text-gray-400">
                            {findGovernorById(selectedGovernor).party ? ` (${findGovernorById(selectedGovernor).party_code || findGovernorById(selectedGovernor).party})` : ''}
                          </span>
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">No governor selected</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-left font-bold text-custom-blue text-black/50 leading-4 mt-2 py-4 border-b border-gray-200 mt-8">Tell us something about you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-sm">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleUserInfoChange}
                      className="h-12 border rounded-md border-gray-200 mt-2 px-4 min-w-0"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-sm">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleUserInfoChange}
                      className="h-12 border rounded-md border-gray-200 mt-2 px-4 min-w-0"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="mobile" className="text-sm">Mobile</label>
                    <input 
                      type="text" 
                      name="mobile"
                      value={userInfo.mobile}
                      onChange={handleUserInfoChange}
                      className="h-12 border rounded-md border-gray-200 mt-2 px-4 min-w-0"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="age" className="text-sm">Age</label>
                      <input 
                        type="number" 
                        name="age"
                        value={userInfo.age}
                        onChange={handleUserInfoChange}
                        className="h-12 border rounded-md border-gray-200 mt-2 px-4 appearance-none min-w-0"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label htmlFor="sex" className="text-sm">Sex</label>
                      <select 
                        name="sex"
                        value={userInfo.sex}
                        onChange={handleUserInfoChange}
                        className="h-12 border rounded-md border-gray-200 mt-2 px-4 text-sm min-w-0"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 md:col-span-2">
                    <label htmlFor="email" className="text-sm">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                      className="h-12 border rounded-md border-gray-200 mt-2 px-4 min-w-0 w-full"
                    />
                  </div>
                </div>
                
                {/* Submission message */}
                {submissionMessage && (
                  <p className={`mt-4 text-sm ${submissionMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {submissionMessage.text}
                  </p>
                )}
                
                <div className="flex flex-col md:items-center mt-4 md:flex-row-reverse gap-2">
                  <button 
                    onClick={handleVoteSubmit}
                    disabled={submitting}
                    className={`py-3 text-white font-medium rounded-md text-sm flex-1 flex items-center justify-center ${
                      submitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-custom-green hover:bg-custom-green/90 transition-colors cursor-pointer'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Vote Now'
                    )}
                  </button>
                  <button 
                    onClick={closeModal}
                    className="py-3 bg-gray-200 flex-1 cursor-pointer font-medium text-sm rounded-md"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
    </>
  );
}

export default Vote; 