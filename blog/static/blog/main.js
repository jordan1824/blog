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