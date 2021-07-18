const inputSearch = document.getElementById('search')
const sort = document.getElementById('sort')
var sortValue = ''
inputSearch.addEventListener('input', (e) => {
  const searchValue = e.target.value
})
sort.addEventListener('change', (e) => {
  sortValue = e.target.value
})
