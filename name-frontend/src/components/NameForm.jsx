import { useState } from 'react'
import Popup from './Popup.jsx'
import './NameForm.css'

const API_URL = import.meta.env.VITE_API_URL

function NameForm() {
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState({ visible: false, type: 'success', message: '' })

  const showPopup = (type, message) => setPopup({ visible: true, type, message })
  const closePopup = () => setPopup((p) => ({ ...p, visible: false }))

  const handleSubmit = async (event) => {
    event.preventDefault() // stop the browser from reloading the page

    const body = {
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
    }

    // frontend check for convenience; the backend @NotBlank is the real protection
    if (!body.firstName || !body.lastName) {
      showPopup('error', 'First name and last name are required.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        // 201 Created: show success, then clear the form
        showPopup('success', 'Saved the form. Thank you!')
        setFirstName('')
        setMiddleName('')
        setLastName('')
      } else if (response.status === 400) {
        showPopup('error', 'Please check your input. First and last name are required.')
      } else {
        showPopup('error', `Server error (${response.status}). Please try again.`)
      }
    } catch {
      // fetch only throws on network problems (backend down, wrong URL, CORS blocked)
      showPopup('error', 'Could not reach the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Enter your name</h2>

        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="middleName">Middle name (optional)</label>
          <input
            id="middleName"
            name="middleName"
            type="text"
            placeholder="Enter middle name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>

      {popup.visible && (
        <Popup type={popup.type} message={popup.message} onClose={closePopup} />
      )}
    </div>
  )
}

export default NameForm