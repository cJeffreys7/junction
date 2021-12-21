import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './GroupForm.module.css'

// Services
import { createGroup, getAllGroups } from '../../services/groupService'

// Components
import GroupCategories from '../GroupCategories/GroupCategories'
import ImageUploadNativeAWS from '../ImageUpload/ImageUploadNativeAWS'


const GroupForm = props => {
  const navigate = useNavigate()
  const [groupCategory, setGroupCategory] = useState('Family')
  const [file, setFile] = useState({
    image: 'https://avatars.dicebear.com/api/initials/CreateGroup.svg'
  })
  const [formData, setFormData] = useState({
    title: '',
    category: 'Family',
    avatar: '',
    location: '',
  })
  const fileUpload = useRef(null)

  const handleChange = event => {
    props.updateMessage('')
    if (event.target.files) {
      console.log('File name:', event.target.files[0].name)
      let reader = new FileReader()
      reader.onload = e => {
        setFile({
          fullFile: event.target.files[0],
          name: event.target.files[0].name,
          image: e.target.result
        })
      }
      reader.readAsDataURL(event.target.files[0])
      setFormData({
        ...formData,
        category: groupCategory,
        avatar: `https://junction-image-storage.s3.us-east-2.amazonaws.com/${event.target.files[0].name}`
      })
    } else {
      setFormData({
        ...formData,
        category: groupCategory,
        [event.target.name]: event.target.value,
      })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      fileUpload.current(file.fullFile)
      await createGroup(formData)
      let allGroups = await getAllGroups()
      let id = allGroups[allGroups.length - 1]._id
      navigate(`/groups/${id}`)
    } catch (err) {
      props.updateMessage(err.message)
    }
  }

  const { title, category, avatar, location } = formData

  const isFormInvalid = () => {
    return !(title && category && avatar)
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <div className={styles.inputContainer}>
        <label htmlFor="title" className={styles.label}>Title</label>
        <input
          type="text"
          autoComplete="off"
          id="name"
          value={title}
          name="title"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="category" className={styles.label}>Category</label>
        <GroupCategories 
          setGroupCategory={setGroupCategory} 
          groupCategory={groupCategory} 
          handleChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="location" className={styles.label}>Location</label>
        <input
          type="text"
          autoComplete="off"
          id="location"
          value={location}
          name="location"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <img 
        src={file.image} 
        alt="group avatar" style={{width: "150px"}} 
        />
        <ImageUploadNativeAWS
          fileUpload={fileUpload}
          handleChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <button disabled={isFormInvalid()} className={styles.button}>
          Create Group
        </button>
        <Link to="/groups">
          <button>Cancel</button>
        </Link>
      </div>
    </form>
  )
}

export default GroupForm
