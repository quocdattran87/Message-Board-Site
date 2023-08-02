  // Reference: https://stackoverflow.com/questions/65980310/profanity-filter-with-reactjs
  let profanities = [
    'arse',
    'ass',
    'asshole',
    'bastard',
    'bitch',
    'bollocks',
    'bugger',
    'bullshit',
    'cunt',
    'crap',
    'damn',
    'fuck',
    'frigger',
    ]

  // Reference: https://stackoverflow.com/questions/65980310/profanity-filter-with-reactjs
  const profanityCheck = (id, text, post_type, profanity, setProfanity, profanityReply, setProfanityReply, profanityReply2, setProfanityReply2) =>{
    const foundSwears = profanities.filter(word => text.toLowerCase().includes(word.toLowerCase()))
    if(foundSwears.length){
      if (post_type === 'post') {
        profanity[id] = true
        setProfanity(profanity)
      } else if (post_type === 'reply') {
        profanityReply[id] = true
        setProfanityReply(profanityReply)
      } else if (post_type === 'reply2') {
        profanityReply2[id] = true
        setProfanityReply2(profanityReply2)
      }
    } else {
      if (post_type === 'post') {
        profanity[id] = false
        setProfanity(profanity)
      } else if (post_type === 'reply') {
        profanityReply[id] = false
        setProfanityReply(profanityReply)
      } else if (post_type === 'reply2') {
        profanityReply2[id] = false
        setProfanityReply2(profanityReply2)
      }
    }
  }

  export {
    profanityCheck
  }