'use strict';
const inputSearch = document.getElementById('search');
const sort = document.getElementById('sort');
const totalResults = document.getElementById('total_results');
const results = document.getElementById('search_results');
const page = document.getElementById('page_number');
var currentPage = 1;
var repositoriesTotalCount = 0;
const pagination = document.getElementById('pagination');
var timeout = null;
var sortValue = '';
var orderValue = '';
const searchQuery = `https://api.github.com/search/repositories?per_page=10&q=`;
inputSearch.addEventListener('input', (e) => {
  const searchValue = e.target.value;
  if (searchValue && timeout === null) {
    pagination.style.visibility = 'hidden';
    // show placeholder while typing
    totalResults.innerHTML = '';
    results.appendChild(showLoadingFrame());
    // throttle api requests for 1500 ms
    timeout = setTimeout(async () => {
      resetState();
      await fetchRepositories();
      timeout = null;
    }, 1500);
  } else if (searchValue === '') {
    results.innerHTML = '';
    totalResults.innerHTML = '';
    pagination.style.visibility = 'hidden';
  }
});
sort.addEventListener('change', (e) => {
  const value = e.target.value;
  if (value !== '') {
    sortValue = value.split('_')[0];
    orderValue = value.split('_')[1];
  } else {
    sortValue = '';
    orderValue = '';
  }
  fetchRepositories();
});
async function fetchRepositories() {
  try {
    if (inputSearch.value) {
      const repositories = await fetch(
        `${searchQuery}${encodeURIComponent(
          inputSearch.value
        )}&sort=${sortValue}&order=${orderValue}&page=${currentPage}`
      ).then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else if (res.status === 403) {
          totalResults.innerHTML =
            '<p class="error">The max limit of searches has been exceeded. Please wait a few minutes.</p>';
          results.innerHTML = '';
          pagination.style.visibility = 'hidden';
          throw Error(res.status);
        } else {
          totalResults.innerHTML =
            '<p class="error">An unexpected error ocurred.</p>';
          results.innerHTML = '';
          throw Error(res.status);
        }
      });
      totalResults.innerHTML = `<p>Total Results for  <i>"${
        inputSearch.value
      }"</i>:   <strong>${repositories.total_count.toLocaleString()}</strong></p>`;
      repositoriesTotalCount = repositories.total_count;
      if (repositories.total_count > 0) {
        showRepositories(repositories);
        if (repositories.total_count > 10) {
          pagination.style.visibility = 'visible';
        }
      } else {
        results.innerHTML = '';
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}
function resetState() {
  currentPage = 1;
  page.innerText = currentPage;
  document.getElementById('previous').disabled = true;
  document.getElementById('next').disabled = false;
}
function showRepositories(repositories) {
  results.innerHTML = '';
  const reposContainer = document.createElement('div');
  reposContainer.classList.add('repositories');
  repositories.items.forEach((repo) => {
    const repoItem = document.createElement('div');
    const repoInfo = document.createElement('div');
    const repoDesc = document.createElement('p');
    const repoName = document.createElement('a');
    const repoCountInfo = document.createElement('div');
    const repoStars = document.createElement('div');
    const repoLanguage = document.createElement('div');
    const repoIssues = document.createElement('div');
    const repoForks = document.createElement('div');
    repoItem.classList.add('repo');
    repoInfo.classList.add('repo_info');
    repoDesc.classList.add('repo_description');
    repoCountInfo.classList.add('repo_count_info');
    repoStars.classList.add('repo_stars');
    repoIssues.classList.add('repo_issues');
    repoForks.classList.add('repo_forks');
    repoLanguage.classList.add('repo_language');
    repoName.title = repo.full_name;
    repoDesc.innerText = repo.description;
    repoName.href = repo.html_url;
    repoName.target = '_blank';
    repoName.text = repo.full_name;
    repoInfo.innerHTML = bookSvg;
    repoStars.innerHTML = `${starSvg} <strong>${repo.stargazers_count.toLocaleString()}</strong>`;
    repoForks.innerHTML = ` Forks:  <strong>${repo.forks_count.toLocaleString()}</strong>`;
    repoIssues.innerHTML = `Open Issues: <strong>${repo.open_issues_count.toLocaleString()}</strong>`;
    repoLanguage.innerHTML = `${codeSvg}<strong>${repo.language} </strong>`;
    repoCountInfo.appendChild(repoStars);
    repoCountInfo.appendChild(repoForks);
    repoCountInfo.appendChild(repoIssues);
    if (repo.language) {
      repoCountInfo.appendChild(repoLanguage);
    }
    repoInfo.appendChild(repoName);
    repoInfo.appendChild(repoDesc);
    repoItem.appendChild(repoInfo);
    repoInfo.appendChild(repoCountInfo);
    reposContainer.appendChild(repoItem);
  });
  results.appendChild(reposContainer);
}
async function nextPage() {
  currentPage++;
  page.innerText = currentPage;
  totalResults.innerHTML = '';
  results.appendChild(showLoadingFrame());
  // limit the amount of request to fetch more results
  document.getElementById('previous').disabled = true;
  document.getElementById('next').disabled = true;
  await fetchRepositories();
  if (currentPage < repositoriesTotalCount / 10) {
    document.getElementById('next').disabled = false;
  }
  if (currentPage > 1) {
    document.getElementById('previous').disabled = false;
  }
}
async function previousPage() {
  currentPage--;
  page.innerText = currentPage;
  totalResults.innerHTML = '';
  results.appendChild(showLoadingFrame());
  // limit the amount of request to fetch more results
  document.getElementById('previous').disabled = true;
  document.getElementById('next').disabled = true;
  await fetchRepositories();
  document.getElementById('next').disabled = false;
  document.getElementById('previous').disabled = false;
  if (currentPage === 1) {
    document.getElementById('previous').disabled = true;
  }
}
// loads the placeholder
function showLoadingFrame() {
  results.innerHTML = '';
  const repoLoading = document.createElement('div');
  repoLoading.classList.add('repositories', 'loading');
  for (var i = 0; i < 8; i++) {
    const repoItemLoading = document.createElement('div');
    repoItemLoading.classList.add('repo_loading');
    repoLoading.appendChild(repoItemLoading);
  }
  return repoLoading;
}

const bookSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="git_book" fill="DarkGray" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>`;

const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="starts_svg" fill="yellow" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
</svg>`;

const codeSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="code_svg" viewBox="0 0 20 20" fill="DarkGray">
  <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
</svg>`;
