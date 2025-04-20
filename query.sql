-- Table: tbl_provinces
CREATE TABLE tbl_provinces (
    code VARCHAR(9) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region_code VARCHAR(9) NOT NULL,
    island_group_code ENUM('luzon', 'visayas', 'mindanao') NOT NULL,
    psgc10_digit_code VARCHAR(10) NOT NULL,
    no_of_districts INT NOT NULL CHECK (no_of_districts >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: tbl_positions
CREATE TABLE tbl_positions (
    id INT PRIMARY KEY,         -- e.g., 1 = senator, 2 = party_list
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: tbl_totals
CREATE TABLE tbl_totals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_voters INT NOT NULL CHECK (total_voters >= 0),
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table: tbl_candidates
CREATE TABLE tbl_candidates (
    id INT PRIMARY KEY,
    position_id INT NOT NULL,
    ballot_no INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    party VARCHAR(100) DEFAULT NULL,
    party_code VARCHAR(50) DEFAULT NULL,
    province_code VARCHAR(9) DEFAULT NULL,
    district INT DEFAULT NULL,
    municipality_code VARCHAR(9) DEFAULT NULL,
    picture VARCHAR(255) NOT NULL,
    votes INT NOT NULL CHECK (votes >= 0),
    total_votes INT NOT NULL CHECK (total_votes >= 0),
    vote_percentage DECIMAL(5,2) NOT NULL CHECK (vote_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_position FOREIGN KEY (position_id) REFERENCES tbl_positions(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_province FOREIGN KEY (province_code) REFERENCES tbl_provinces(code)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: tbl_users
CREATE TABLE tbl_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    mobile_number CHAR(11) NOT NULL UNIQUE CHECK (mobile_number REGEXP '^0[0-9]{10}$'),
    age INT NOT NULL CHECK (age >= 0),
    sex ENUM('male', 'female') NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NOT NULL, -- supports both IPv4 and IPv6
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: tbl_user_votes
CREATE TABLE tbl_user_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    candidate_id INT NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_vote_user FOREIGN KEY (user_id)
        REFERENCES tbl_users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_user_vote_candidate FOREIGN KEY (candidate_id)
        REFERENCES tbl_candidates(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    UNIQUE KEY unique_vote (user_id, candidate_id)  -- prevents double voting
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;