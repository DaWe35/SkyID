function docLoaded() {
  document.getElementById("signupAltButton").addEventListener("click", function() {
    window.location.href = "signup.html";
  });

  document.getElementById("signupCon").addEventListener("click", goToSignup);
  document.getElementById("loginCon").addEventListener("click", goToLogin);

  setInterval(function() {
    if (window.innerWidth <= 768 && (window.innerWidth > window.innerHeight)) {
      document.getElementById("message").style.display = "flex";
    }
    else {
      document.getElementById("message").style.display = "none";
    }
  }, 100);
}

function goToSignup() {
  document.getElementById("loginCon").classList.add("small");
  document.getElementById("loginCon").classList.remove("big");
  document.getElementById("signupCon").classList.add("big");
  document.getElementById("signupCon").classList.remove("small");
}

function goToLogin() {
  document.getElementById("loginCon").classList.add("big");
  document.getElementById("loginCon").classList.remove("small");
  document.getElementById("signupCon").classList.add("small");
  document.getElementById("signupCon").classList.remove("big");
}
