import { useState, useEffect } from 'react';

interface Module {
  id: number;
  title: string;
  completed?: boolean;
}

interface CourseProgressData {
  progress: number;
  completedModules: number;
  totalModules: number;
}

export const useCourseProgress = (courseId: string): CourseProgressData => {
  const [progressData, setProgressData] = useState<CourseProgressData>({
    progress: 0,
    completedModules: 0,
    totalModules: 0
  });

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        // Buscar progresso do usuário para este curso
        const progressResponse = await fetch(`http://localhost:4000/api/courses/${courseId}/progress`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (progressResponse.ok) {
          const data = await progressResponse.json();
          setProgressData({
            progress: data.progress || 0,
            completedModules: data.completedModules || 0,
            totalModules: data.totalModules || 0
          });
        } else {
          // Se não há progresso salvo, buscar módulos do curso para calcular total
          const modulesResponse = await fetch(`http://localhost:4000/api/courses/${courseId}/modules`);
          if (modulesResponse.ok) {
            const modules = await modulesResponse.json();
            setProgressData({
              progress: 0,
              completedModules: 0,
              totalModules: modules.length || 0
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar progresso do curso:', error);
        setProgressData({
          progress: 0,
          completedModules: 0,
          totalModules: 0
        });
      }
    };

    if (courseId) {
      fetchCourseProgress();
    }
  }, [courseId]);

  return progressData;
};

export const updateModuleProgress = async (courseId: string, moduleId: string, completed: boolean) => {
  try {
    const response = await fetch(`http://localhost:4000/api/courses/${courseId}/modules/${moduleId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ completed })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar progresso do módulo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    throw error;
  }
};

