'use client';

import { useState, useRef } from 'react';
import { X, Upload, Music, Image as ImageIcon, Loader2 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import styles from './UploadModal.module.css';

export default function UploadModal() {
  const { setShowUploadModal, fetchUserSongs } = usePlayer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    audio: null,
    image: null
  });
  const [previews, setPreviews] = useState({
    audioName: '',
    imageSrc: ''
  });

  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'audio') {
      setFormData(prev => ({ ...prev, audio: file }));
      setPreviews(prev => ({ ...prev, audioName: file.name }));
    } else {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, imageSrc: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.audio || !formData.title) {
      alert('Please provide at least a title and an audio file.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('artist', formData.artist);
    data.append('audio', formData.audio);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        await fetchUserSongs();
        setShowUploadModal(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setShowUploadModal(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setShowUploadModal(false)}>
          <X size={24} />
        </button>
        
        <div className={styles.header}>
          <h2>Upload Your Music</h2>
          <p>Share your produced songs with the world (locally).</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.mainContent}>
            <div className={styles.imageSection}>
              <div 
                className={styles.imageUpload} 
                onClick={() => imageInputRef.current.click()}
                style={{ backgroundImage: previews.imageSrc ? `url(${previews.imageSrc})` : 'none' }}
              >
                {!previews.imageSrc && (
                  <>
                    <ImageIcon size={48} color="var(--text-muted)" />
                    <span>Upload Cover</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={imageInputRef} 
                onChange={e => handleFileChange(e, 'image')}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            <div className={styles.inputsSection}>
              <div className={styles.inputGroup}>
                <label>Track Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Moonlight Sonata Remix"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Artist Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Master Producer"
                  value={formData.artist}
                  onChange={e => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className={styles.fileSection}>
            <div 
              className={`${styles.audioUpload} ${formData.audio ? styles.hasFile : ''}`}
              onClick={() => audioInputRef.current.click()}
            >
              <Music size={24} />
              <span>{previews.audioName || 'Select Audio File (MP3, WAV, OGG) *'}</span>
              <Upload size={20} className={styles.uploadIcon} />
            </div>
            <input 
              type="file" 
              ref={audioInputRef} 
              onChange={e => handleFileChange(e, 'audio')}
              accept="audio/*"
              style={{ display: 'none' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className={styles.spin} />
                Uploading...
              </>
            ) : 'Finish Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}
