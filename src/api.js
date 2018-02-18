export const fetchBook = () => {
  const apiUrl = "http://localhost:8080/api"
  console.log('Fetching', apiUrl)
  return window.fetch(apiUrl).then(resp => resp.json())
}