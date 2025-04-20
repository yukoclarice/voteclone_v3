import { useEffect, useState } from 'react';
import { doneProgress, startProgress } from '../utils/nprogress';
import { useProvince } from '../context/ProvinceContext';
import { candidateService } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { submitVote, resetVoteStatus } from '../userSlice';

function Vote() {
  const { selectedVoteProvince } = useProvince();
  const dispatch = useDispatch();
  const { loading: submitting, error: submitError, voteStatus } = useSelector((state) => state.user);
  
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
  const [loadingSenators, setLoadingSenators] = useState(true);
  const [loadingPartyLists, setLoadingPartyLists] = useState(true);
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
    sex: 'M',
    email: ''
  });
  
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
    setShowModal(true);
  };
  
  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
    // Clear submission message when closing the modal
    if (voteStatus) {
      dispatch(resetVoteStatus());
      setSubmissionMessage(null);
    }
  };
  
  // Function to find senator by ID
  const findSenatorById = (id) => {
    return senators.find(senator => senator.id === id);
  };
  
  // Function to find party list by ID
  const findPartyListById = (id) => {
    return partyLists.find(partyList => partyList.id === id);
  };
  
  // Function to find governor by ID
  const findGovernorById = (id) => {
    return governors.find(governor => governor.id === id);
  };
  
  // Function to validate form
  const validateForm = () => {
    // Validate user information
    const { firstName, lastName, age, email } = userInfo;
    
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!age || age < 18) return "You must be at least 18 years old to vote";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return "A valid email is required";
    
    // Validate vote selections
    if (selectedSenators.length === 0) return "Please select at least one senator";
    
    return null; // No errors
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
    
    // Prepare vote data
    const voteData = {
      userInfo: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        mobileNumber: userInfo.mobile,
        age: parseInt(userInfo.age),
        sex: userInfo.sex,
        email: userInfo.email,
        provinceCode: selectedVoteProvince
      },
      votes: {
        senators: selectedSenators,
        partyList: selectedPartyList,
        governor: selectedGovernor
      }
    };
    
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
      setSubmissionMessage({
        type: 'success',
        text: 'Your vote has been successfully submitted!'
      });
      
      // Reset selections after successful submission
      setSelectedSenators([]);
      setSelectedPartyList(null);
      setSelectedGovernor(null);
      
      // Close modal after a delay
      setTimeout(() => {
        closeModal();
      }, 3000);
    }
  }, [voteStatus]);

  // Handle submission error
  useEffect(() => {
    if (submitError) {
      setSubmissionMessage({
        type: 'error',
        text: typeof submitError === 'string' ? submitError : 'Failed to submit your vote. Please try again.'
      });
    }
  }, [submitError]);
  
  // Load senators and party lists on component mount
  useEffect(() => {
    // Save the original document title
    const originalTitle = document.title;
    
    // Change the document title when component mounts
    document.title = "Vote Now";
    
    // Fetch senators
    const fetchSenators = async () => {
      setLoadingSenators(true);
      try {
        const response = await candidateService.getSenators();
        // Sort by ballot_no before setting state
        const sortedSenators = [...(response.data || [])].sort((a, b) => a.ballot_no - b.ballot_no);
        setSenators(sortedSenators);
        setSenatorsError(null);
      } catch (error) {
        console.error('Error fetching senators:', error);
        setSenatorsError('Failed to load senators');
      } finally {
        setLoadingSenators(false);
      }
    };
    
    // Fetch party lists
    const fetchPartyLists = async () => {
      setLoadingPartyLists(true);
      try {
        const response = await candidateService.getPartyLists();
        // Sort by ballot_no before setting state
        const sortedPartyLists = [...(response.data || [])].sort((a, b) => a.ballot_no - b.ballot_no);
        setPartyLists(sortedPartyLists);
        setPartyListsError(null);
      } catch (error) {
        console.error('Error fetching party lists:', error);
        setPartyListsError('Failed to load party lists');
      } finally {
        setLoadingPartyLists(false);
      }
    };
    
    // Fetch data
    startProgress();
    Promise.all([fetchSenators(), fetchPartyLists()])
      .finally(() => {
        doneProgress();
      });
    
    // Restore the original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, []);
  
  // Load governors when province changes
  useEffect(() => {
    // Clear previously selected governor when province changes
    setSelectedGovernor(null);
    
    if (!selectedVoteProvince) {
      setGovernors([]);
      return;
    }
    
    const fetchGovernors = async () => {
      setLoadingGovernors(true);
      startProgress();
      try {
        const response = await candidateService.getGovernors(selectedVoteProvince);
        // Sort by ballot_no before setting state
        const sortedGovernors = [...(response.data || [])].sort((a, b) => a.ballot_no - b.ballot_no);
        setGovernors(sortedGovernors);
        setGovernorsError(null);
      } catch (error) {
        console.error('Error fetching governors:', error);
        setGovernorsError('Failed to load governors for this province');
      } finally {
        setLoadingGovernors(false);
        doneProgress();
      }
    };
    
    fetchGovernors();
  }, [selectedVoteProvince]);

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
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-1">
                      {senators.map((senator) => (
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
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-1">
                      {partyLists.map((partyList) => (
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
                        {governors.map((governor) => (
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
                  className="bg-custom-green text-white px-16 h-10 rounded-md text-sm self-center mt-8 cursor-pointer"
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
                className="bg-white rounded-lg px-8 py-6 max-w-xl flex flex-col max-h-full overflow-y-auto my-8" 
                aria-hidden="true"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-extrabold text-lg text-center md:text-xl text-custom-blue leading-5">SUBMIT YOUR VOTE</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400">Senator</p>
                      <div className="grid">
                        {selectedSenators.map(id => {
                          const senator = findSenatorById(id);
                          return senator ? (
                            <p key={id} className="font-semibold">
                              {senator.ballot_no}. {senator.name} 
                              <span className="font-normal text-gray-400">
                                {senator.party ? ` (${senator.party_code || senator.party})` : ''}
                              </span>
                            </p>
                          ) : null;
                        })}
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
                        <option value="M">Male</option>
                        <option value="F">Female</option>
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
                    className={`py-3 text-white/80 font-medium rounded-md text-sm cursor-pointer flex-1 ${submitting ? 'bg-gray-400' : 'bg-custom-green'}`}
                  >
                    {submitting ? 'Submitting...' : 'Vote Now'}
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
    </>
  );
}

export default Vote; 