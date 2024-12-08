import React, { useEffect, useRef, useState } from 'react';

interface VideoAnalyticsEvent {
  timestamp: number;
  currentTime: number;
  eventType: 'playing' | 'paused' | 'timeUpdate';
}

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [events, setEvents] = useState<VideoAnalyticsEvent[]>([]);
  
  // Intervalo para enviar eventos (en milisegundos)
  const ANALYTICS_INTERVAL = 5000;

  const sendAnalytics = (event: VideoAnalyticsEvent) => {
    // Aquí puedes implementar la lógica para enviar los eventos a tu backend
    console.log('Evento de análisis:', event);
    setEvents(prev => [...prev, event]);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let analyticsInterval: NodeJS.Timeout;

    const handlePlay = () => {
      sendAnalytics({
        timestamp: Date.now(),
        currentTime: videoElement.currentTime,
        eventType: 'playing'
      });
    };

    const handlePause = () => {
      sendAnalytics({
        timestamp: Date.now(),
        currentTime: videoElement.currentTime,
        eventType: 'paused'
      });
    };

    // Configurar el intervalo para enviar eventos periódicos
    const startAnalyticsInterval = () => {
      analyticsInterval = setInterval(() => {
        if (!videoElement.paused) {
          sendAnalytics({
            timestamp: Date.now(),
            currentTime: videoElement.currentTime,
            eventType: 'timeUpdate'
          });
        }
      }, ANALYTICS_INTERVAL);
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    startAnalyticsInterval();

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      clearInterval(analyticsInterval);
    };
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        controls
        width="100%"
        height="auto"
      >
        <source src="/ruta-a-tu-video.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Panel de eventos para desarrollo */}
      <div className="events-panel">
        <h3>Eventos registrados:</h3>
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-item">
              <strong>Tipo:</strong> {event.eventType}
              <br />
              <strong>Tiempo:</strong> {new Date(event.timestamp).toLocaleTimeString()}
              <br />
              <strong>Tiempo actual:</strong> {event.currentTime} segundos
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 