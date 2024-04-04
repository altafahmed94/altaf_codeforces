document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("error-message").style.display = "none";
    
    var button = document.querySelector("button");
    var isButtonEnabled = true;
  
    button.addEventListener("click", function (event) {
      event.preventDefault();
  
      if (!isButtonEnabled) {
        return;
      }
  
      isButtonEnabled = false;
      setTimeout(function () {
        isButtonEnabled = true;
      }, 1000);

      let mainUsername = document.getElementById("main-username").value; // Get main user's username

      let categories = {};
      document.getElementById("error-message").style.display = "none";
      let submissionsList = document.getElementById("submissions");
      while (submissionsList.firstChild) {
        submissionsList.removeChild(submissionsList.firstChild);
      }

      // Fetch main user's submissions
      fetch("https://codeforces.com/api/user.status?handle=" + mainUsername)
        .then((response) => response.json())
        .then((mainUserData) => {
          let mainUserSubmissions = new Set();
          mainUserData.result.forEach((submission) => {
            if (submission.verdict === "OK") {
              let problemId = submission.problem.contestId + submission.problem.index;
              mainUserSubmissions.add(problemId);
            }
          });

          let username = document.querySelector("#username").value;

          // Fetch user's submissions
          fetch("https://codeforces.com/api/user.status?handle=" + username)
            .then((response) => response.json())
            .then((data) => {
              if (data.status != "FAILED") {
                let submissions = data.result;
                submissions.forEach((submission) => {
                  if (submission.verdict === "OK") {
                    let rating = submission.problem.rating;
                    if (!categories[rating]) {
                      categories[rating] = [];
                    }
                    categories[rating].push(submission);
                  }
                });

                // loop through the categories object
                for (let key in categories) {
                  if (categories[key].length > 0) {
                    let category = document.createElement("h2");
                    category.innerHTML = key;
                    category.classList.add("collapse-head");
                    category.addEventListener("click", function () {
                      this.classList.toggle("active-heading");
  
                      let next = this.nextElementSibling;
                      if (next.style.display === "block") {
                        next.style.display = "none";
                      } else {
                        next.style.display = "block";
                      }
                    });
                    document.getElementById("submissions").appendChild(category);
                    let list = document.createElement("ul");
                    list.style.display = "none";
  
                    let processedProblems = new Set();
                    let counter = 0;
                    categories[key].forEach((submission) => {
                      let problemId = submission.problem.contestId + submission.problem.index;
                      if (!processedProblems.has(problemId)) {
                        counter++;
                        let item = document.createElement("li");
                        let link = document.createElement("a");
                        link.setAttribute(
                          "href",
                          "https://codeforces.com/contest/" +
                            submission.problem.contestId +
                            "/problem/" +
                            submission.problem.index
                        );
                        link.setAttribute("target", "_blank");
                        link.innerHTML =
                          submission.problem.contestId +
                          submission.problem.index +
                          " - " +
                          submission.problem.name;

                        // Check if problem is solved by main user
                        if (mainUserSubmissions.has(problemId)) {
                          link.style.color = "green";
                        }

                        link.classList.add("problemName");
                        item.appendChild(link);
                        let submissionLink = document.createElement("a");
                        submissionLink.setAttribute(
                          "href",
                          "https://codeforces.com/contest/" +
                            submission.problem.contestId +
                            "/submission/" +
                            submission.id
                        );
                        submissionLink.classList.add("submissionLink");
                        submissionLink.innerHTML = "Submission";
                        item.appendChild(submissionLink);
                        list.appendChild(item);
                        processedProblems.add(problemId);
                      }
                    });
                    category.classList.add("noselect");
                    category.innerHTML = key + " rated solve: " + counter;
                    document.getElementById("submissions").appendChild(list);
                  }
                }
              } else {
                document.getElementById("error-message").style.display = "block";
              }
            });
        });
    });
  });
  
  // Create a scroll to top button
  let scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "&#8593;";
  scrollToTopBtn.classList.add("scroll-to-top-btn");
  document.body.appendChild(scrollToTopBtn);
  
  // Hide the button by default
  scrollToTopBtn.style.display = "none";
  
  // Show the button when the user scrolls down
  window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  };
  
  // Scroll to the top of the page when the button is clicked
  scrollToTopBtn.addEventListener("click", function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
