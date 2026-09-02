import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

CustomEase.create('modalOpen', 'M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1')
CustomEase.create('flowSoft', 'M0,0 C0.25,0.1 0.25,1 1,1')

const professionalsData = {
  'Dra. Sofía De los Ríos': {
    years: 12,
    matricula: 'MP 4521',
    bio: 'Egresada de la Universidad Nacional del Litoral con especialización en medicina preventiva. Apasionada por la educación en salud animal y el vínculo humano-animal.',
    history: [
      'Jefa de Clínica Médica - Hospital Veterinario del Litoral (2016-2020)',
      'Docente adscripta en Semiología - UNL (2018-2022)',
      'Coordinadora del programa de castración comunitaria en Paraná',
    ],
  },
  'Dra. Camila Martínez': {
    years: 9,
    matricula: 'MP 5103',
    bio: 'Especialista en dermatología veterinaria, con formación de posgrado en la Universidad de Buenos Aires. Referente regional en el tratamiento de alergias y enfermedades dermatológicas complejas.',
    history: [
      'Residencia en Dermatología - Hospital Escuela FCV-UBA (2017-2019)',
      'Consultora en dermatología para clínicas de la región mesopotámica',
      'Investigación en dermatitis atópica canina publicada en revista AVEACA',
    ],
  },
  'Dra. Lucía Benítez': {
    years: 7,
    matricula: 'MP 5890',
    bio: 'Pionera en odontología veterinaria en la provincia de Entre Ríos. Formada en técnicas de periodoncia y cirugía oral avanzada con instrumental de última generación.',
    history: [
      'Certificación en Odontología Veterinaria - AOVRA (2019)',
      'Práctica exclusiva en odontología desde 2020',
      'Más de 800 procedimientos dentales realizados',
    ],
  },
  'Dr. Matías Giménez': {
    years: 15,
    matricula: 'MP 3784',
    bio: 'Cirujano veterinario con amplia trayectoria en cirugía de tejidos blandos y traumatología. Formación continua en técnicas quirúrgicas mínimamente invasivas.',
    history: [
      'Jefe de Cirugía - Clínica Veterinaria Central, Rosario (2012-2018)',
      'Fellowship en Cirugía Ortopédica - Universidad de La Plata (2015)',
      'Instructor en cursos de cirugía para graduados jóvenes',
    ],
  },
  'Dra. Valeria Acosta': {
    years: 11,
    matricula: 'MP 4892',
    bio: 'Especialista en diagnóstico por imágenes y cardiología veterinaria. Cuenta con equipamiento propio de ecografía y ecocardiografía Doppler.',
    history: [
      'Residencia en Diagnóstico por Imágenes - FCV-UBA (2015-2017)',
      'Cardióloga referente en la zona centro de Entre Ríos',
      'Certificación ECVIM en ecocardiografía avanzada',
    ],
  },
  'Dra. Florencia Ortíz': {
    years: 8,
    matricula: 'MP 5234',
    bio: 'Profesional dedicada a la atención de urgencias y emergencias veterinarias. Capacitada en triage, estabilización y cuidados críticos las 24 horas del día.',
    history: [
      'Guardia de emergencias - Hospital Veterinario del Sur (2018-2021)',
      'Curso de Emergentología y Cuidados Intensivos - LAVECCS (2020)',
      'Coordinadora del servicio de guardia de Veterinaria La Mary',
    ],
  },
}

export function flowIn(container, opts = {}) {
  const {
    duration = 0.5,
    stagger = 0.06,
    y = 20,
    blur = 16,
    delay = 0,
  } = opts

  const elements = Array.from(container.children).filter(el => {
    const style = getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })

  return gsap.fromTo(
    elements,
    { y: -y, opacity: 0, filter: `blur(${blur}px)` },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration, ease: 'flowSoft', stagger, delay },
  )
}

export function flowOut(container, opts = {}) {
  const {
    duration = 0.35,
    stagger = 0.03,
    y = 16,
    blur = 12,
  } = opts

  const elements = Array.from(container.children).filter(el => {
    const style = getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })

  return new Promise(resolve => {
    gsap.to(elements, {
      y,
      opacity: 0,
      filter: `blur(${blur}px)`,
      duration,
      ease: 'flowSoft',
      stagger,
      onComplete: resolve,
    })
  })
}

let activeModal = null
let previousFocusedElement = null

function createModalHTML(data) {
  const historyItems = data.history
    .map(item => `<li>${item}</li>`)
    .join('')

  return `
    <button class="prof-modal__close" aria-label="Cerrar modal" type="button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <div class="prof-modal__hero">
      <div class="prof-modal__photo-wrapper">
        <img class="prof-modal__photo" src="${data.imgSrc}" alt="${data.name}">
      </div>
      <div class="prof-modal__hero-info">
        <h3 class="prof-modal__name">${data.name}</h3>
        <span class="prof-modal__specialty">${data.specialty}</span>
        <div class="prof-modal__badges">
          <span class="prof-modal__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${data.years} años de profesión
          </span>
          <span class="prof-modal__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></svg>
            ${data.matricula}
          </span>
          <span class="prof-modal__badge prof-modal__badge--accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Consulta ${data.price}
          </span>
        </div>
      </div>
    </div>

    <div class="prof-modal__body">
      <div class="prof-modal__section">
        <h4 class="prof-modal__section-title">Sobre ${data.name}</h4>
        <p class="prof-modal__bio">${data.bio}</p>
      </div>

      <div class="prof-modal__section">
        <h4 class="prof-modal__section-title">Trayectoria profesional</h4>
        <ul class="prof-modal__history">
          ${historyItems}
        </ul>
      </div>
    </div>
  `
}

function openModal(tr) {
  if (activeModal) return

  const cells = tr.querySelectorAll('td')
  const imgEl = tr.querySelector('img')
  const name = cells[1]?.textContent?.trim()
  const specialty = cells[2]?.textContent?.trim()
  const price = cells[3]?.textContent?.trim()

  const extraData = professionalsData[name]
  if (!extraData || !imgEl) return

  const data = {
    name,
    specialty,
    price,
    imgSrc: imgEl.src,
    ...extraData,
  }

  previousFocusedElement = document.activeElement

  const fromTrRect = tr.getBoundingClientRect()
  const originImgRect = imgEl.getBoundingClientRect()

  const backdrop = document.createElement('div')
  backdrop.className = 'prof-modal-backdrop'
  backdrop.setAttribute('role', 'presentation')

  const modal = document.createElement('div')
  modal.className = 'prof-modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-label', `Información de ${name}`)
  modal.setAttribute('tabindex', '-1')
  modal.innerHTML = createModalHTML(data)

  const toWidth = Math.min(580, window.innerWidth - 32)
  const maxHeight = window.innerHeight - 48
  Object.assign(modal.style, {
    position: 'fixed',
    width: `${toWidth}px`,
    maxHeight: `${maxHeight}px`,
    overflow: 'hidden',
    visibility: 'hidden',
    top: '-9999px',
    left: '-9999px',
  })

  backdrop.appendChild(modal)
  document.body.appendChild(backdrop)

  const naturalHeight = modal.scrollHeight
  const toHeight = Math.min(naturalHeight, maxHeight)
  const toLeft = Math.round((window.innerWidth - toWidth) / 2)
  const toTop = Math.round(Math.max(16, (window.innerHeight - toHeight) / 2))

  Object.assign(modal.style, {
    top: `${toTop}px`,
    left: `${toLeft}px`,
    height: `${toHeight}px`,
    visibility: 'visible',
  })

  const modalPhoto = modal.querySelector('.prof-modal__photo')
  const targetImgRect = modalPhoto.getBoundingClientRect()

  modalPhoto.style.visibility = 'hidden'

  const ghostImg = document.createElement('img')
  ghostImg.src = data.imgSrc
  ghostImg.alt = name
  ghostImg.className = 'prof-modal-ghost-img'
  Object.assign(ghostImg.style, {
    position: 'fixed',
    top: `${originImgRect.top}px`,
    left: `${originImgRect.left}px`,
    width: `${originImgRect.width}px`,
    height: `${originImgRect.height}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    zIndex: '3000',
    pointerEvents: 'none',
    willChange: 'top, left, width, height, border-radius',
  })
  document.body.appendChild(ghostImg)

  imgEl.style.opacity = '0'

  Object.assign(modal.style, {
    top: `${fromTrRect.top}px`,
    left: `${fromTrRect.left}px`,
    width: `${fromTrRect.width}px`,
    height: `${fromTrRect.height}px`,
    borderRadius: '12px',
    backgroundColor: 'rgba(238, 236, 230, 0.98)',
    overflow: 'hidden',
    opacity: '1',
  })

  const heroInfo = modal.querySelector('.prof-modal__hero-info')
  const modalBody = modal.querySelector('.prof-modal__body')
  const closeBtn = modal.querySelector('.prof-modal__close')

  gsap.set(closeBtn, { opacity: 0, scale: 0.7 })
  gsap.set(heroInfo, { opacity: 0, filter: 'blur(10px)', y: -6 })
  if (modalBody) {
    Array.from(modalBody.children).forEach(child => {
      gsap.set(child, { opacity: 0, filter: 'blur(12px)', y: -8 })
    })
  }

  activeModal = {
    backdrop,
    modal,
    originImg: imgEl,
    tr,
    data,
    toTop,
    toLeft,
    toWidth,
    toHeight,
    isClosing: false,
  }

  gsap.fromTo(
    backdrop,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'power2.out' },
  )

  gsap.to(modal, {
    top: toTop,
    left: toLeft,
    width: toWidth,
    height: toHeight,
    borderRadius: window.innerWidth < 640 ? '20px' : '28px',
    backgroundColor: '#f4f3ef',
    duration: 0.65,
    ease: 'modalOpen',
    onComplete() {
      modal.style.overflowY = 'auto'
      modal.style.overflowX = 'hidden'
    },
  })

  gsap.to(ghostImg, {
    top: targetImgRect.top,
    left: targetImgRect.left,
    width: targetImgRect.width,
    height: targetImgRect.height,
    borderRadius: window.innerWidth < 640 ? '20px' : '24px',
    duration: 0.65,
    ease: 'modalOpen',
    onComplete() {
      modalPhoto.style.visibility = 'visible'
      ghostImg.remove()
    },
  })

  gsap.to(closeBtn, {
    opacity: 1,
    scale: 1,
    duration: 0.35,
    delay: 0.28,
    ease: 'power2.out',
  })

  gsap.to(heroInfo, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.45,
    delay: 0.22,
    ease: 'flowSoft',
  })

  if (modalBody) {
    Array.from(modalBody.children).forEach((child, i) => {
      gsap.to(child, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.45,
        delay: 0.3 + i * 0.08,
        ease: 'flowSoft',
      })
    })
  }

  backdrop.addEventListener('click', onBackdropClick)
  backdrop.addEventListener('wheel', (e) => {
    if (e.target === backdrop) e.preventDefault()
  }, { passive: false })
  closeBtn.addEventListener('click', closeModal)
  document.addEventListener('keydown', onKeyDown)

  setTimeout(() => {
    modal.focus({ preventScroll: true })
  }, 100)
}

function closeModal() {
  if (!activeModal || activeModal.isClosing) return
  activeModal.isClosing = true

  const { backdrop, modal, originImg, tr, data } = activeModal
  const modalPhoto = modal.querySelector('.prof-modal__photo')
  const heroInfo = modal.querySelector('.prof-modal__hero-info')
  const modalBody = modal.querySelector('.prof-modal__body')
  const closeBtn = modal.querySelector('.prof-modal__close')

  backdrop.removeEventListener('click', onBackdropClick)
  document.removeEventListener('keydown', onKeyDown)

  tr.style.transform = 'none'
  originImg.style.transform = 'none'
  const currentTrRect = tr.getBoundingClientRect()
  const currentOriginImgRect = originImg.getBoundingClientRect()
  const currentModalPhotoRect = modalPhoto.getBoundingClientRect()

  modal.style.overflow = 'hidden'
  modalPhoto.style.visibility = 'hidden'

  const ghostImg = document.createElement('img')
  ghostImg.src = data.imgSrc
  ghostImg.alt = data.name
  ghostImg.className = 'prof-modal-ghost-img'
  Object.assign(ghostImg.style, {
    position: 'fixed',
    top: `${currentModalPhotoRect.top}px`,
    left: `${currentModalPhotoRect.left}px`,
    width: `${currentModalPhotoRect.width}px`,
    height: `${currentModalPhotoRect.height}px`,
    borderRadius: window.innerWidth < 640 ? '20px' : '24px',
    objectFit: 'cover',
    zIndex: '3000',
    pointerEvents: 'none',
    willChange: 'top, left, width, height, border-radius',
  })
  document.body.appendChild(ghostImg)

  const contentItems = [closeBtn, heroInfo]
  if (modalBody) contentItems.push(...Array.from(modalBody.children))
  gsap.to(contentItems, {
    opacity: 0,
    filter: 'blur(8px)',
    y: 8,
    duration: 0.2,
    ease: 'power2.in',
    stagger: 0.02,
  })

  gsap.to(ghostImg, {
    top: currentOriginImgRect.top,
    left: currentOriginImgRect.left,
    width: currentOriginImgRect.width,
    height: currentOriginImgRect.height,
    borderRadius: '50%',
    opacity: 0,
    duration: 0.55,
    ease: 'modalOpen',
    onStart() {
      gsap.to(originImg, {
        opacity: 1,
        duration: 0.3,
        delay: 0.25,
        ease: 'power2.out',
      })
    },
    onComplete() {
      ghostImg.remove()
    },
  })

  gsap.to(modal, {
    top: currentTrRect.top,
    left: currentTrRect.left,
    width: currentTrRect.width,
    height: currentTrRect.height,
    borderRadius: '12px',
    backgroundColor: 'rgba(238, 236, 230, 0.98)',
    opacity: 0.15,
    duration: 0.55,
    ease: 'modalOpen',
  })

  gsap.to(backdrop, {
    opacity: 0,
    duration: 0.45,
    delay: 0.1,
    ease: 'power2.in',
    onComplete() {
      backdrop.remove()
      originImg.style.opacity = '1'
      originImg.style.transform = ''
      tr.style.transform = ''
      if (previousFocusedElement && previousFocusedElement.isConnected) {
        previousFocusedElement.focus({ preventScroll: true });
      }
      activeModal = null
    },
  })
}

function onBackdropClick(e) {
  const modal = activeModal?.modal
  if (modal && !modal.contains(e.target)) {
    closeModal()
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeModal()
    return
  }

  if (e.key === 'Tab' && activeModal) {
    const modal = activeModal.modal
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusableEls = Array.from(modal.querySelectorAll(focusableSelector))
    if (!focusableEls.length) return

    const first = focusableEls[0]
    const last = focusableEls[focusableEls.length - 1]
    const active = document.activeElement

    if (e.shiftKey) {
      if (active === first || !modal.contains(active)) {
        e.preventDefault()
        last.focus({ preventScroll: true })
      }
    } else {
      if (active === last || !modal.contains(active)) {
        e.preventDefault()
        first.focus({ preventScroll: true })
      }
    }
  }
}

function init() {
  const table = document.querySelector('.professionals-table')
  if (!table) return

  const rows = table.querySelectorAll('tbody tr')

  rows.forEach(tr => {
    tr.style.cursor = 'pointer'
    tr.setAttribute('role', 'button')
    tr.setAttribute('tabindex', '0')
    const name = tr.querySelectorAll('td')[1]?.textContent?.trim() || ''
    tr.setAttribute('aria-label', `Ver perfil de ${name}`)

    tr.addEventListener('click', () => openModal(tr))

    tr.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openModal(tr)
      }
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
