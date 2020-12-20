//TODO: remove this
export default function() {
  const pageSelect = document.querySelectorAll('[data-page-select]')

  for (let i = 0; i < pageSelect.length; i++) {
    pageSelect[i].addEventListener('change', function(e) {
      window.location.href = e.target.value
    })
  }
}
