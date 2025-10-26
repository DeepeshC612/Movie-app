'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/lib/toast-context';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  publishingYear: z.string().min(1, 'Publishing year is required'),
  poster: z.any().optional()
}).refine((data) => {
  // Custom validation for image
  return data.poster && data.poster.length > 0;
}, {
  message: 'Movie poster is required',
  path: ['poster']
});

type MovieForm = z.infer<typeof movieSchema>;

export default function AddMovie() {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, setError } = useForm<MovieForm>({
    resolver: zodResolver(movieSchema)
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setValue('poster', e.target.files as any);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      setValue('poster', e.dataTransfer.files as any);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (data.status) {
      return data.result.url;
    }
    throw new Error(data.message);
  };

  const onSubmit = async (data: MovieForm) => {
    // Manual validation for image
    if (!image) {
      setError('poster', { message: 'Movie poster is required' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login first', 'error');
        window.location.href = '/signin';
        return;
      }

      let posterUrl = '';
      if (image) {
        setUploading(true);
        posterUrl = await uploadImage(image);
      }

      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: data.title, 
          publishingYear: data.publishingYear, 
          poster: posterUrl 
        })
      });
      
      const result = await response.json();
      
      if (result.status) {
        showToast(result.message, 'success');
        setTimeout(() => {
          window.location.href = '/movies';
        }, 1000);
      } else {
        showToast(result.message || 'Failed to create movie', 'error');
      }
    } catch (error) {
      showToast('Failed to create movie: ' + error, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/movies';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative overflow-hidden" 
           >
      

        {/* Content */}
        <div className="relative z-20 max-w-6xl mx-auto">
          <h1 className="text-white mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            Create a new movie
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Image Upload Area */}
            <div className="w-full lg:flex-1">
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                className="w-full h-64 sm:h-80 lg:h-96 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-colors relative overflow-hidden"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                {image ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-white/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-white/60 text-center text-sm sm:text-base">Drop an image here</p>
                  </>
                )}
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {/* @ts-ignore */}
              {errors.poster && <p className="text-red-400 text-sm mt-2">{errors.poster.message}</p>}
            </div>

            {/* Form Fields */}
            <div className="w-full lg:flex-1 space-y-6">
              <div>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="Title"
                  className="w-full h-12 px-4 text-white placeholder-white/50 border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-sm sm:text-base font-normal leading-6"
                  style={{ backgroundColor: '#224957' }}
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <select
                  {...register('publishingYear')}
                  className="w-full h-12 px-4 text-white border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2BD17E]/30 text-sm sm:text-base font-normal leading-6"
                  style={{ backgroundColor: '#224957' }}
                >
                  <option value="" disabled className="text-white/50">Publishing year</option>
                  {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year} style={{ backgroundColor: '#224957', color: 'white' }}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.publishingYear && <p className="text-red-400 text-sm mt-1">{errors.publishingYear.message}</p>}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:flex-1 h-12 font-semibold text-white border border-white/30 rounded-xl transition-all duration-200 hover:bg-white/10 text-sm sm:text-base leading-6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="w-full sm:flex-1 h-12 font-semibold text-white rounded-xl transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0 text-sm sm:text-base leading-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ 
                    backgroundColor: '#2BD17E',
                    boxShadow: '0 4px 12px rgba(43, 209, 126, 0.3)'
                  }}
                >
                  {isSubmitting || uploading ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
        </div>
    </ProtectedRoute>
  );
}
