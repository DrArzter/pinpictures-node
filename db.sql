USE my_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    picpath VARCHAR(255) DEFAULT 'uploads/users/default_avatar.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorid INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    picpath VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorid) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorid INT NOT NULL,
    postid INT NOT NULL,
    comment TEXT NOT NULL,
    picpath VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authorid INT NOT NULL,
    postid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id),
    UNIQUE KEY (authorid, postid)
);

CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    picpath VARCHAR(255)
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


