const inputSearch = document.getElementById('search')
const sort = document.getElementById('sort')
const totalResults = document.getElementById('total_results')
const results = document.getElementById('search_results')
const page = document.getElementById('page_number')
var currentPage = 1
var repositoriesTotalCount = 0
const pagination = document.getElementById('pagination')
var timeout = null
var sortValue = ''
const searchQuery = `https://api.github.com/search/repositories?per_page=10&q=`
inputSearch.addEventListener('input', (e) => {
  const searchValue = e.target.value
  try {
    if (searchValue && timeout === null) {
      pagination.style.visibility = 'hidden'
      // show placeholder while typing
      totalResults.innerHTML = ''
      results.appendChild(showLoadingFrame())
      // throttle api requests for 1500 ms
      timeout = setTimeout(async () => {
        resetState()
        await fetchRepositories()
        timeout = null
      }, 1500)
    } else if (searchValue === '') {
      results.innerHTML = ''
      totalResults.innerHTML = ''
      pagination.style.visibility = 'hidden'
    }
  } catch (e) {
    console.error(e)
  }
})
sort.addEventListener('change', (e) => {
  sortValue = e.target.value
  fetchRepositories()
})
async function fetchRepositories() {
  try {
    if (inputSearch.value) {
      const repositories = await fetch(
        `${searchQuery}${inputSearch.value}&sort=${sortValue}&page=${currentPage}`
      ).then((res) => res.json())
      totalResults.innerHTML = `<p>Total Results for  <i>"${
        inputSearch.value
      }"</i>:   <strong>${repositories.total_count.toLocaleString()}</strong></p>`
      repositoriesTotalCount = repositories.total_count
      if (repositories.total_count > 0) {
        showRepositories(repositories)
        if (repositories.total_count > 10) {
          pagination.style.visibility = 'visible'
        }
      } else {
        results.innerHTML = ''
      }
    }
  } catch (e) {
    console.error(e)
  }
}
function resetState () {
   currentPage = 1
   page.innerText = currentPage
   document.getElementById('previous').disabled = true
   document.getElementById('next').disabled = false
}
function showRepositories(repositories) {
  results.innerHTML = ''
  const reposContainer = document.createElement('div')
  reposContainer.classList.add('repositories')
  repositories.items.forEach((repo) => {
    const repoItem = document.createElement('div')
    const repoInfo = document.createElement('div')
    const repoDesc = document.createElement('p')
    const repoName = document.createElement('a')
    repoItem.classList.add('repo')
    repoInfo.classList.add('repo_info')
    repoDesc.classList.add('repo_description')
    repoName.title = repo.full_name
    repoDesc.innerText = repo.description
    repoName.href = repo.html_url
    repoName.target = '_blank'
    repoName.text = repo.full_name
    repoInfo.innerHTML = bookSvg
    repoInfo.appendChild(repoName)
    repoInfo.appendChild(repoDesc)
    repoItem.appendChild(repoInfo)
    reposContainer.appendChild(repoItem)
  })
  results.appendChild(reposContainer)
}
async function nextPage() {
  currentPage++
  page.innerText = currentPage
  totalResults.innerHTML = ''
  results.appendChild(showLoadingFrame())
  // limit the amount of request to fetch more results
  document.getElementById('previous').disabled = true
  document.getElementById('next').disabled = true
  await fetchRepositories()
  if (currentPage < (repositoriesTotalCount /10)) {
    document.getElementById('next').disabled = false
  }
  if (currentPage > 1) {
    document.getElementById('previous').disabled = false
  }
}
async function previousPage() {
  currentPage--
  page.innerText = currentPage
  totalResults.innerHTML = ''
  results.appendChild(showLoadingFrame())
  // limit the amount of request to fetch more results
  document.getElementById('previous').disabled = true
  document.getElementById('next').disabled = true
  await fetchRepositories()
  document.getElementById('next').disabled = false
  document.getElementById('previous').disabled = false
  if (currentPage === 1) {
    document.getElementById('previous').disabled = true
  }
}
function showLoadingFrame() {
  results.innerHTML = ''
  const repoLoading = document.createElement('div')
  repoLoading.classList.add('repositories', 'loading')
  for (var i = 0; i < 8; i++) {
    const repoItemLoading = document.createElement('div')
    repoItemLoading.classList.add('repo-loading')
    repoLoading.appendChild(repoItemLoading)
  }
  return repoLoading
}

const bookSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="git_book" fill="DarkGray" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>`
