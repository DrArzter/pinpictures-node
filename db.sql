USE my_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    bananaLevel INT CHECK (bananaLevel >= 0 AND bananaLevel <= 3) DEFAULT 0,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    picpath VARCHAR(255) DEFAULT 'uploads/users/default_avatar.jpg',
    bgpicpath VARCHAR(255) DEFAULT 'uploads/users/default_background.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    banned INT CHECK (banned >= 0 AND banned <= 1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS images_in_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postid INT NOT NULL,
    picpath VARCHAR(255),
    bucketkey VARCHAR(255),
    FOREIGN KEY (postid) REFERENCES posts(id)
);
    
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    postid INT NOT NULL,
    comment TEXT NOT NULL,
    picpath VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    postid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id),
    UNIQUE KEY (userid, postid)
);

CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    picpath VARCHAR(255) DEFAULT 'uploads/chats/default_avatar.jpg'
);

CREATE TABLE IF NOT EXISTS users_in_chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    chatid INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (chatid) REFERENCES chats(id),
    UNIQUE KEY (userid, chatid)
);

CREATE TABLE IF NOT EXISTS messages_in_chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    chatid INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (chatid) REFERENCES chats(id)
);

CREATE TABLE IF NOT EXISTS images_in_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    messageid INT NOT NULL,
    picpath VARCHAR(255),
    FOREIGN KEY (messageid) REFERENCES messages_in_chats(id)
);

CREATE TABLE IF NOT EXISTS friendships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'blocked') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id),
    UNIQUE KEY (user1_id, user2_id),
    CHECK (user1_id < user2_id)
);

