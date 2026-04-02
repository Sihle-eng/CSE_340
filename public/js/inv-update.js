document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#updateForm")
  const updateBtn = form.querySelector("button[type='submit']")

  // Enable button when any field changes
  form.addEventListener("input", function () {
    updateBtn.removeAttribute("disabled")
  })

  // Client-side validation
  form.addEventListener("submit", function (e) {
    let valid = true
    const requiredFields = [
      'classificationList', 'inv_make', 'inv_model', 'inv_year',
      'inv_description', 'inv_image', 'inv_thumbnail',
      'inv_price', 'inv_miles', 'inv_color'
    ]
    requiredFields.forEach(function (id) {
      const el = document.getElementById(id)
      if (!el || !el.value.trim()) {
        valid = false
        if (el) el.focus()
      }
    })
    if (!valid) {
      alert('Please fill out all required fields.')
      e.preventDefault()
    }
  })
})
