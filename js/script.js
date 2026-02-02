const clickAudio = document.querySelector('.click-audio')
const remained = document.querySelector('.remain')
const nextButton = document.querySelector('.nextButton')

let s1 = ''
let s2 = ''

let dance01 = document.querySelector('.dance1')
let dance02 = document.querySelector('.dance2')
let dance03 = document.querySelector('.dance3')

const x = document.querySelector('.s1')
const y = document.querySelector('.s2')

let spinInterval = null
let gameStarted = false   // 🔴 important fix

///////////////////////////////////////////////////////
// Students via browser + localStorage
///////////////////////////////////////////////////////
const STORAGE_KEY = 'students_list_v1'
let students = []

const setupPanel = document.querySelector('#setupPanel')
const studentsInput = document.querySelector('#studentsInput')
const saveStudentsBtn = document.querySelector('#saveStudentsBtn')
const toggleSetupBtn = document.querySelector('#toggleSetupBtn')
const clearStudentsBtn = document.querySelector('#clearStudentsBtn')
const studentsCountLabel = document.querySelector('#studentsCountLabel')
const studentsWarnLabel = document.querySelector('#studentsWarnLabel')

const saveStudentsToStorage = (arr) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

const loadStudentsFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const clearStudentsStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const normalizeInputToArray = (text) => {
  const lines = text
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  const seen = new Set()
  const unique = []
  for (const name of lines) {
    const key = name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(name)
    }
  }
  return unique
}

const updateSetupMeta = () => {
  studentsCountLabel.textContent = `${students.length} students`
  studentsWarnLabel.textContent =
    students.length > 0 && students.length % 2 !== 0
      ? 'Odd count. Add 1 more.'
      : ''
}

const updateRemainUI = () => {
  if (!gameStarted) {
    remained.innerHTML = ''
    return
  }

  if (students.length > 0) {
    remained.innerHTML = students.length + ' students left'
  } else {
    remained.innerHTML = 'You really tried to spin the last 2...?'
  }
}

const refreshNextButtonState = () => {
  nextButton.disabled = students.length < 2
}

const openSetup = () => setupPanel.classList.add('is-open')
const closeSetup = () => setupPanel.classList.remove('is-open')
const toggleSetup = () => setupPanel.classList.toggle('is-open')

///////////////////////////////////////////////////////
// INIT
///////////////////////////////////////////////////////
const initStudents = () => {
  students = loadStudentsFromStorage()
  studentsInput.value = students.join('\n')

  updateSetupMeta()
  updateRemainUI()
  refreshNextButtonState()
  closeSetup()
}

toggleSetupBtn.addEventListener('click', toggleSetup)

saveStudentsBtn.addEventListener('click', () => {
  students = normalizeInputToArray(studentsInput.value)
  saveStudentsToStorage(students)

  gameStarted = false
  x.innerHTML = ''
  y.innerHTML = ''
  clearInterval(spinInterval)

  updateSetupMeta()
  updateRemainUI()
  refreshNextButtonState()
  closeSetup()
})

clearStudentsBtn.addEventListener('click', () => {
  clearStudentsStorage()
  students = []
  studentsInput.value = ''

  gameStarted = false
  x.innerHTML = ''
  y.innerHTML = ''
  clearInterval(spinInterval)

  dance01.setAttribute('src', '')
  dance02.setAttribute('src', '')
  dance03.setAttribute('src', '')

  updateSetupMeta()
  updateRemainUI()
  refreshNextButtonState()
  openSetup()
})

initStudents()

///////////////////////////////////////////////////////
// SPIN LOGIC (unchanged behavior)
///////////////////////////////////////////////////////
const randm = () => {
  closeSetup()
  gameStarted = true   

  if (students.length < 2) {
    updateRemainUI()
    openSetup()
    return
  }

  let index1 = Math.floor(Math.random() * students.length)
  s1 = students[index1]
  students.splice(index1, 1)

  let index2 = Math.floor(Math.random() * students.length)
  s2 = students[index2]
  students.splice(index2, 1)

  saveStudentsToStorage(students)
  updateRemainUI()

  clickAudio.currentTime = 0
  clickAudio.play()

  nextButton.disabled = true
  x.innerHTML = ''
  y.innerHTML = ''

  clearInterval(spinInterval)
  spinInterval = setInterval(() => {
    if (students.length === 0) return

    const a = students[Math.floor(Math.random() * students.length)]
    let b = a
    if (students.length > 1) {
      while (b === a) b = students[Math.floor(Math.random() * students.length)]
    }

    x.innerHTML = a
    y.innerHTML = b
  }, 90)

  setTimeout(() => {
    clearInterval(spinInterval)
    x.innerHTML = s1
    y.innerHTML = s2

    dance01.setAttribute('src', 'img/dance 1.gif')
    dance02.setAttribute('src', 'img/dance 2.gif')
    dance03.setAttribute('src', 'img/dance 4.gif')
  }, 7700)

  setTimeout(() => {
    nextButton.disabled = false
    dance01.setAttribute('src', '')
    dance02.setAttribute('src', '')
    dance03.setAttribute('src', '')

    updateSetupMeta()
    refreshNextButtonState()

    if (students.length < 2) openSetup()
  }, 36000)
}
