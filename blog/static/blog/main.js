let savePostLinks = document.querySelectorAll(".save-post-link")
let savedPostBtnList = document.querySelector(".home-saved-posts")
let onSavedPostPage = document.querySelector(".saved-posts-title")

let removePost = function(btnElement) {
  let post = btnElement.parentElement.parentElement.parentElement.parentElement
  post.style.height = `${post.offsetHeight}px`
  post.classList.add("fade-away-animation")
  post.addEventListener("animationend", () => {
    post.classList.remove("fade-away-animation")
    post.style.opacity = 0
    post.classList.add("slide-animation")
    post.addEventListener("animationend", () => {
      post.parentElement.remove()
      post.remove()
      if (!document.querySelector(".single-post")) {
        let p = document.createElement('p')
        p.className = 'text-white bg-dark saved-post-p border border-light text-center my-4 mx-auto p-3 px-sm-5'
        p.innerHTML = "You do not have any saved posts.<br><br>Saved posts will get stored here, so you can read through them when you have the time."
        document.querySelector("main").insertBefore(p, document.querySelector(".savedpostslink"))
      }
    })
  })
}

let insertCurrentEl = function(postID, postTitle) {
  let listLink = document.createElement('a')
  listLink.setAttribute('type', 'button')
  listLink.setAttribute('data-id', `${postID}`)
  listLink.setAttribute('href', `post/${postID}`)
  listLink.className = 'btn btn-primary border border-dark'
  listLink.innerHTML = postTitle
  if (!savedPostBtnList.querySelector(".btn")) {
    savedPostBtnList.innerHTML = `<div class='p-3 bg-primary save-btn-list'>
    <h5 class='mb-0'>Saved Posts</h5>
    </div>`
  }
  savedPostBtnList.insertBefore(listLink, savedPostBtnList.children[1])
}

let removeCurrentEl = function(postID) {
  let currentEl = savedPostBtnList.querySelector(`[data-id="${postID}"]`)
  savedPostBtnList.removeChild(currentEl)
  if (savedPostBtnList.childElementCount == 1) {
    savedPostBtnList.innerHTML = `<div class='p-3 save-btn-list'>
    <h5 class='mb-0'>Saved Posts</h5>
    </div>
    <p class='text-dark bg-light mt-1 mb-0 p-2'>You do not have any saved posts.<br><br>Saved posts will get stored here, so you can read through them when you have the time.</p>`
  }
}

let savePost = function(el) {
  let postID = el.getAttribute("data-id")
  fetch(`/post/${postID}/save/`)
  .then(response => response.text())
  .then(text => {
    if (text == "Removed") {
      if (onSavedPostPage) {
        removePost(el)
      } else {
        el.innerHTML = "Save Post"
        el.blur()
        if (savedPostBtnList) {
          removeCurrentEl(postID)
        }
      }
    } else if (text == "Saved") {
      el.innerHTML = "Saved"
      el.blur()
      let postTitle = el.parentElement.parentElement.querySelector(".card-title").innerHTML
      if (savedPostBtnList) {
        insertCurrentEl(postID, postTitle)
      }
    } else {
      console.log("error.")
    }
  })
  .catch(function() {
    console.log("Please try again later.")
  })
}

savePostLinks.forEach(link => link.addEventListener("click", function(event) {
  event.preventDefault()
  savePost(link)
}))

if (document.querySelector(".comment-btn")) {
  let commentBtn = document.querySelector(".comment-btn")
  let commentInput = document.querySelector(".comment-input")
  commentBtn.addEventListener("click", (event) => {
    if (commentInput.value.length == 0) {
      event.preventDefault()
    }
  })
}

class FormErrorMessage {
  constructor() {
    this.registerFormFields = document.querySelectorAll(".register-field")
    this.usernameCounter = 0
    this.emailCounter = 0
    this.passwordCounter = 0
    this.passwordConfirmCounter = 0
    this.firstNameCounter = 0
    this.lastNameCounter = 0
    if (this.registerFormFields) {this.events()}
  }

  // Events
  events() {
    this.registerFormFields.forEach(field => field.addEventListener("keyup", () => {
      if (field.classList.contains("username")) {
        this.usernameFieldHandler(field)
      }
      if (field.classList.contains("email")) {
        this.emailFieldHandler(field)
      }
      if (field.classList.contains("password")) {
        this.passwordFieldHandler(field)
      }
      if (field.classList.contains("password-confirm")) {
        this.passwordConfirmFieldHandler(field)
      }
      if (field.classList.contains("first-name")) {
        this.firstNameFieldHandler(field)
      }
      if (field.classList.contains("last-name")) {
        this.lastNameFieldHandler(field)
      }
    }))
  }

  // Models

  usernameFieldHandler(field) {
    let errors = 0;
    clearTimeout(this.usernameCounter)
    if (field.value.length > 50) {errors = this.insertAlert(field, "Your username cannot exceed 50 characters.", errors)}
    if (field.value.match(/[$&+,:;=?@#|'<>.^*()%!_-]+/)) {errors = this.insertAlert(field, "Your username cannot contain special characters.", errors)}
    this.usernameTimedChecks(field, errors)
    if (!errors) {
      this.removeAlert(field)
    }
  }

  usernameTimedChecks(field, errors) {
    if (field.value.length > 0 && field.value.length < 4) {
      this.usernameCounter = setTimeout(() => errors = this.insertAlert(field, "Your username must be atleast 4 characters long.", errors), 2000)
    }
    if (field.value.length == 0) {
      this.usernameCounter = setTimeout(() => errors = this.insertAlert(field, "You must enter a valid username.", errors), 2000)
    }
  }

  emailFieldHandler(field) {
    let errors = 0;
    clearTimeout(this.emailCounter)
    if (field.value.length > 200) {errors = this.insertAlert(field, "Your email cannot exceed 200 characters.", errors)}
    this.emailTimedChecks(field, errors)
    if (!errors) {
      this.removeAlert(field)
    }
  }

  emailTimedChecks(field, errors) {
    if (!field.value.match(/[A-Za-z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/)) {
      this.emailCounter = setTimeout(() => errors = this.insertAlert(field, "You must provide a valid email address.", errors), 3000)
    }
  }

  passwordFieldHandler(field) {
    let errors = 0;
    clearTimeout(this.passwordCounter)
    if (field.value.length > 50) {errors = this.insertAlert(field, "Your password cannot exceed 50 characters.", errors)}
    this.passwordTimedChecks(field, errors)
    if (!errors) {
      this.removeAlert(field)
    }
  }

  passwordTimedChecks(field, errors) {
    if (field.value.length > 0 && field.value.length < 8) {
      this.passwordCounter = setTimeout(() => errors = this.insertAlert(field, "Your password must be atleast 8 characters long.", errors), 2000)
    }
    if (field.value.length == 0) {
      this.passwordCounter = setTimeout(() => errors = this.insertAlert(field, "You must enter a valid password.", errors), 2000)
    }
  }

  passwordConfirmFieldHandler(field) {
    let errors = 0;
    clearTimeout(this.passwordConfirmCounter)
    this.passwordConfirmTimedChecks(field, errors)
    if (!errors) {
      this.removeAlert(field)
    }
  }

  passwordConfirmTimedChecks(field, errors) {
    if (field.value != document.querySelector(".password").value) {
      this.passwordConfirmCounter = setTimeout(() => errors = this.insertAlert(field, "Your passwords do not match.", errors), 2000)
    }
  }

  firstNameFieldHandler(field) {
    let errors = 0;
    clearTimeout(this.firstNameCounter)
    if (field.value.length > 250) {errors = this.insertAlert(field, "Your first name cannot exceed 250 characters.", errors)}
    this.firstNameTimedChecks(field, errors)
    if (!errors) {
      this.removeAlert(field)
    }
  }

  firstNameTimedChecks(field, errors) {
    if (field.value.length == 0) {
      this.firstNameCounter = setTimeout(() => errors = this.insertAlert(field, "You must enter a valid first name.", errors), 2000)
    }
  }

  lastNameFieldHandler(field) {
    let errors = 0;
    clearTimeout(this.lastNameCounter)
    if (field.value.length > 250) {errors = this.insertAlert(field, "Your last name cannot exceed 250 characters.", errors)}
    this.lastNameTimedChecks(field, errors)
    if (!errors) {
      this.removeAlert(field)
    }
  }

  lastNameTimedChecks(field, errors) {
    if (field.value.length == 0) {
      this.lastNameCounter = setTimeout(() => errors = this.insertAlert(field, "You must enter a valid last name.", errors), 2000)
    }
  }

  insertAlert(field, message, errors) {
    errors += 1;
    if (!field.parentElement.querySelector(".alert")) {
      field.parentElement.insertAdjacentHTML("afterbegin", this.alertHTML(message))
      field.parentElement.querySelector(".alert").addEventListener("animationend", function() {
        this.classList.remove("error-popup-animation")
    })
    }
    return errors
  }

  alertHTML(error) {
    return `<div class='alert error-popup-animation'>
      <p class='error-message'>${error}</p>
    </div>`
  }

  removeAlert(field) {
    if (field.parentElement.querySelector(".alert")) {
      let currentFieldAlert = field.parentElement.querySelector(".alert")
      currentFieldAlert.classList.add("reverse-error-popup-animation")
      currentFieldAlert.addEventListener("animationend", function() {
        currentFieldAlert.remove()
      })
    }
  }

}

new FormErrorMessage()