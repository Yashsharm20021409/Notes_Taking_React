
export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // 3 part [abc] + @[gmail] + .[com]
    return regex.test(email);
}

export const getInitials = (name) =>{
    if(!name){
        return "";
    }

    const words = name.split(" ");
    let initials = "";

    // if length of name is more than 2 then take only two words from it
    // Example Name = Yash kumar Sharma run loop only for yash and kumar to get initials char of 2 words
    for(let i = 0 ; i<Math.min(words.length,2) ; i++){
        // Taking first letter from each word
        initials += words[i][0];
    }

    return initials.toUpperCase();
}