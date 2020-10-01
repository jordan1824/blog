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
    this.registerForm = document.querySelector(".register-form")
    // Counters to keep track of each alert
    this.usernameCounter = 0
    this.emailCounter = 0
    this.passwordCounter = 0
    this.passwordConfirmCounter = 0
    this.firstNameCounter = 0
    this.lastNameCounter = 0
    // Error tracker for each field
    this.usernameErrors = 0
    this.emailErrors = 0
    this.passwordErrors = 0
    this.passwordConfirmErrors = 0
    this.firstNameErrors = 0
    this.lastNameErrors = 0
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
    this.registerForm.addEventListener("submit", (event) => {
      // Prevents submission when fields are empty
      this.registerFormFields.forEach(field => {
        if (field.value.length == 0) {
          event.preventDefault()
        }
      })
      // Prevents submission when there are errors
      let totalErrors = this.usernameErrors + this.emailErrors + this.passwordErrors + this.passwordConfirmErrors + this.firstNameErrors + this.lastNameErrors
      if (totalErrors > 0) {
        event.preventDefault()
      }
    })
  }

  // Models

  usernameFieldHandler(field) {
    if (!document.querySelector("#email-field").classList.contains("field-visible")) {
      document.querySelector("#email-field").classList.add("field-visible")
    }
    this.usernameErrors = 0;
    clearTimeout(this.usernameCounter)
    if (field.value.length > 50) {this.usernameErrors = this.insertAlert(field, "Your username cannot exceed 50 characters.", this.usernameErrors)}
    if (field.value.match(/[$&+,:;=?@#|'<>.^*()%!_-]+/)) {this.usernameErrors = this.insertAlert(field, "Your username cannot contain special characters.", this.usernameErrors)}
    this.usernameTimedChecks(field)
    if (!this.usernameErrors) {
      this.removeAlert(field)
    }
  }

  usernameTimedChecks(field) {
    if (field.value.length > 0 && field.value.length < 4) {
      this.usernameCounter = setTimeout(() => this.usernameErrors = this.insertAlert(field, "Your username must be at least 4 characters long.", this.usernameErrors), 1500)
    }
    if (field.value.length == 0) {
      this.usernameCounter = setTimeout(() => this.usernameErrors = this.insertAlert(field, "You must enter a valid username.", this.usernameErrors), 1500)
    }
  }

  emailFieldHandler(field) {
    if (!document.querySelector("#password-field").classList.contains("field-visible")) {
      document.querySelector("#password-field").classList.add("field-visible")
    }
    this.emailErrors = 0;
    clearTimeout(this.emailCounter)
    if (field.value.length > 200) {this.emailErrors = this.insertAlert(field, "Your email cannot exceed 200 characters.", this.emailErrors)}
    this.emailTimedChecks(field)
    if (!this.emailErrors) {
      this.removeAlert(field)
    }
  }

  emailTimedChecks(field) {
    if (!field.value.match(/[A-Za-z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/)) {
      this.emailCounter = setTimeout(() => this.emailErrors = this.insertAlert(field, "You must provide a valid email address.", this.emailErrors), 1500)
    }
  }

  passwordFieldHandler(field) {
    if (!document.querySelector("#confirm-password-field").classList.contains("field-visible")) {
      document.querySelector("#confirm-password-field").classList.add("field-visible")
    }
    this.passwordErrors = 0;
    clearTimeout(this.passwordCounter)
    if (field.value.length > 50) {this.passwordErrors = this.insertAlert(field, "Your password cannot exceed 50 characters.", this.passwordErrors)}
    this.passwordTimedChecks(field)
    if (!this.passwordErrors) {
      this.removeAlert(field)
    }
  }

  passwordTimedChecks(field) {
    if (field.value.length > 0 && field.value.length < 8) {
      this.passwordCounter = setTimeout(() => this.passwordErrors = this.insertAlert(field, "Your password must be at least 8 characters long.", this.passwordErrors), 1500)
    }
    if (field.value.length == 0) {
      this.passwordCounter = setTimeout(() => this.passwordErrors = this.insertAlert(field, "You must enter a valid password.", this.passwordErrors), 1500)
    }
  }

  passwordConfirmFieldHandler(field) {
    this.passwordConfirmErrors = 0;
    clearTimeout(this.passwordConfirmCounter)
    this.passwordConfirmTimedChecks(field)
    if (!this.passwordConfirmErrors) {
      this.removeAlert(field)
    }
  }

  passwordConfirmTimedChecks(field) {
    if (field.value != document.querySelector(".password").value) {
      this.passwordConfirmCounter = setTimeout(() => this.passwordConfirmErrors = this.insertAlert(field, "Your passwords do not match.", this.passwordConfirmErrors), 1500)
    }
  }

  firstNameFieldHandler(field) {
    this.firstNameErrors = 0;
    clearTimeout(this.firstNameCounter)
    if (field.value.length > 250) {this.firstNameErrors = this.insertAlert(field, "Your first name cannot exceed 250 characters.", this.firstNameErrors)}
    if (field.value.match(/[$&+,:;=?@#|<>.^*()%!_-]+/)) {this.firstNameErrors = this.insertAlert(field, "Your first name cannot contain special characters.", this.firstNameErrors)}
    this.firstNameTimedChecks(field)
    if (!this.firstNameErrors) {
      this.removeAlert(field)
    }
  }

  firstNameTimedChecks(field) {
    if (field.value.length == 0) {
      this.firstNameCounter = setTimeout(() => this.firstNameErrors = this.insertAlert(field, "You must enter a valid first name.", this.firstNameErrors), 1500)
    }
  }

  lastNameFieldHandler(field) {
    this.lastNameErrors = 0;
    clearTimeout(this.lastNameCounter)
    if (field.value.length > 250) {this.lastNameErrors = this.insertAlert(field, "Your name cannot exceed 250 characters.", this.lastNameErrors)}
    if (field.value.match(/[$&+,:;=?@#|<>.^*()%!_-]+/)) {this.lastNameErrors = this.insertAlert(field, "Your name cannot contain special characters.", this.lastNameErrors)}
    this.lastNameTimedChecks(field)
    if (!this.lastNameErrors) {
      this.removeAlert(field)
    }
  }

  lastNameTimedChecks(field) {
    if (field.value.length == 0) {
      this.lastNameCounter = setTimeout(() => this.lastNameErrors = this.insertAlert(field, "You must enter a valid last name.", this.lastNameErrors), 1500)
    }
  }

  insertAlert(field, message, errors) {
    errors += 1;
    if (!field.parentElement.querySelector(".form-alert")) {
      field.parentElement.insertAdjacentHTML("afterbegin", this.alertHTML(message))
      field.parentElement.querySelector(".form-alert").addEventListener("animationend", function() {
        this.classList.remove("error-popup-animation")
    })
    }
    return errors
  }

  alertHTML(error) {
    return `<div class='form-alert error-popup-animation'>
      <p class='error-message'>${error}</p>
    </div>`
  }

  removeAlert(field) {
    if (field.parentElement.querySelector(".form-alert")) {
      let currentFieldAlert = field.parentElement.querySelector(".form-alert")
      currentFieldAlert.classList.add("reverse-error-popup-animation")
      currentFieldAlert.addEventListener("animationend", function() {
        currentFieldAlert.remove()
      })
    }
  }

}

new FormErrorMessage()