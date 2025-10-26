'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfirmModal from '@/components/ConfirmModal';
import Spinner from '@/components/Spinner';
import { useToast } from '@/lib/toast-context';

interface Movie {
  id: number;
  title: string;
  publishingYear: number;
  poster?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; movieId: number | null }>({
    isOpen: false,
    movieId: null
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const fetchMovies = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/movies?page=${page}&limit=8`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status) {
        setMovies(data.result.movies);
        setPagination(data.result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    window.location.href = '/movies/add';
  };

  const handleEditMovie = (movieId: number) => {
    window.location.href = `/movies/edit/${movieId}`;
  };

  const handleDeleteMovie = async (movieId: number) => {
    setConfirmModal({ isOpen: true, movieId });
  };

  const confirmDelete = async () => {
    if (!confirmModal.movieId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/movies/${confirmModal.movieId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.status) {
        showToast(data.message, 'success');
        // Stay on current page, but go to page 1 if current page becomes empty
        const newPage = movies.length === 1 && pagination.currentPage > 1 
          ? pagination.currentPage - 1 
          : pagination.currentPage;
        fetchMovies(newPage);
      } else {
        showToast(data.message || 'Failed to delete movie', 'error');
      }
    } catch (error) {
      showToast('Failed to delete movie', 'error');
    } finally {
      setConfirmModal({ isOpen: false, movieId: null });
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, movieId: null });
  };

  const handlePageChange = (page: number) => {
    fetchMovies(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.href = '/signin';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#093545' }}>
          <Spinner size="w-8 h-8" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="px-4 py-6 sm:py-8 lg:py-12">
        
        {movies.length === 0 ? (
          // Empty State
          <div className="min-h-screen flex items-center justify-center px-4">
            {/* Logout button in top right */}
            <div className="absolute top-6 right-6 z-30">
                <button onClick={handleLogout} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer">
                  <span className="hidden sm:inline text-sm sm:text-base font-medium">Logout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
            </div>
            
            <div className="relative z-20 text-center">
              <h1 className="text-white mb-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                Your movie list is empty
              </h1>
              <button onClick={handleAddMovie} className="px-6 py-3 sm:px-8 font-semibold text-white rounded-xl transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0 text-sm sm:text-base cursor-pointer" style={{ backgroundColor: '#2BD17E', boxShadow: '0 4px 12px rgba(43, 209, 126, 0.3)' }}>
                Add a new movie
              </button>
            </div>
          </div>
        ) : (
          // Movie List
          <div className="">
            <div className="relative z-20 max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 sm:mb-12">
                <div className="flex items-center gap-4">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                    My movies
                  </h1>
                  <button onClick={handleAddMovie} className="w-8 h-8 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer">
                  <span className="hidden sm:inline text-sm sm:text-base font-medium">Logout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Movie Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 justify-items-center">
                {movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="group cursor-pointer p-2 pb-4 rounded-xl relative w-full max-w-[282px]"
                    style={{ 
                      backgroundColor: '#092C39',
                      borderRadius: '12px',
                      paddingTop: '8px',
                      paddingRight: '8px',
                      paddingBottom: '16px',
                      paddingLeft: '8px',
                      gap: '16px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Edit/Delete buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMovie(movie.id);
                        }}
                        className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMovie(movie.id);
                        }}
                        className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div 
                      className="overflow-hidden group-hover:scale-105 transition-transform duration-200 w-full"
                      style={{
                        aspectRatio: '266/400',
                        borderRadius: '12px'
                      }}
                    >
                      <img 
                        src={movie.poster || '/api/placeholder/266/400'} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                    <div className="flex flex-col" style={{ gap: '16px' }}>
                      <h3 className="text-white text-base sm:text-lg font-medium truncate">{movie.title}</h3>
                      <p className="text-white/60 text-sm">{movie.publishingYear}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="text-white hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                  >
                    Prev
                  </button>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded font-medium transition-colors ${
                          pagination.currentPage === page 
                            ? 'bg-[#2BD17E] text-white' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="text-white hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </ProtectedRoute>
  );
}
