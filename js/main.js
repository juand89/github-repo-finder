const inputSearch = document.getElementById('search')
const sort = document.getElementById('sort')
var sortValue = ''
const page = 1
const searchQuery = `https://api.github.com/search/repositories?per_page=10&q=`
inputSearch.addEventListener('input', async (e) => {
  const searchValue = e.target.value
  try {
    if (searchValue) {
      const repositories = await fetch(
        `${searchQuery}${searchValue}&sort=${sortValue}&page=${page}`
      ).then((res) => res.json())

      console.log(repositories)
    }
  } catch (e) {
    console.error(e)
  }
})
sort.addEventListener('change', (e) => {
  sortValue = e.target.value
})
