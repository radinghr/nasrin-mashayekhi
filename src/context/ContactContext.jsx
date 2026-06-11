import { createContext, useContext, useEffect, useState } from 'react'

const ContactContext = createContext(null)

export function ContactProvider({ children }) {
  const [contact, setContact] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}contact.json`)
      .then((r) => r.json())
      .then(setContact)
      .catch(() => setContact({ email: '', phone: '', whatsapp: '' }))
  }, [])

  return (
    <ContactContext.Provider value={contact}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContact() {
  return useContext(ContactContext)
}
