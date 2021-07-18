const inputSearch = document.getElementById('search')
const sort = document.getElementById('sort')
const totalResults = document.getElementById('total_results')
var timeout = null
var sortValue = ''
const page = 1
const searchQuery = `https://api.github.com/search/repositories?per_page=10&q=`
inputSearch.addEventListener('input', (e) => {
  const searchValue = e.target.value
  try {
    if (searchValue && timeout === null) {
      // throttle api requests for 1500 ms
      timeout = setTimeout(async () => {
        const repositories = await fetch(
          `${searchQuery}${inputSearch.value}&sort=${sortValue}&page=${page}`
        ).then((res) => res.json())
        totalResults.innerHTML = `<p>Total Results for  <i>"${
          inputSearch.value
        }"</i>:   <strong>${repositories.total_count.toLocaleString()}</strong></p>`
        timeout = null
      }, 1500)
    }
  } catch (e) {
    console.error(e)
  }
})
sort.addEventListener('change', (e) => {
  sortValue = e.target.value
})
