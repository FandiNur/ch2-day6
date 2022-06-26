// user send a mail to admin
function submitData(){
  const name = document.getElementById("input-name").value
  const email = document.getElementById("input-email").value
  const phone= document.getElementById("input-phone").value
  const subject = document.getElementById("input-subject").value
  const message = document.getElementById("input-message").value

  // ALERT !!!
  if (name == '') {
    return alert("check your name") 
  } else if (email == '') { 
    return alert("check your email") 
  } else if (phone == '') { 
    return alert("check your phone number")
  } else if (subject == '') { 
    return alert("check your subject") 
  } else if (message == '') { 
    return alert("check your message") 
  }

  // a element for make achor
  const emailReceiver = "admin@mail.com"
  const a = document.createElement('a')

  a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hello,nama saya ${name}.Saya ingin memyampaikan,${message}`
  a.click()
}