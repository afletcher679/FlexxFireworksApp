// product-video.tsx - Video player component for displaying product demo videos
// Handles video source resolution from local assets or remote URIs

import { VideoView, useVideoPlayer } from 'expo-video';
import { StyleSheet } from 'react-native';

// Map video file paths to require statements for local assets
const videoAssets: Record<string, any> = {
  'Double_horror_36_shot.mp4': require('@/assets/videos/Double_horror_36_shot.mp4'),
  'Kush_66_shot.mp4': require('@/assets/videos/Kush_66_shot.mp4'),
  'Liberation_Day_300_shot.mp4': require('@/assets/videos/Liberation_Day_300_shot.mp4'),
  'stage_1_49_shots.mp4': require('@/assets/videos/stage_1_49_shots.mp4'),
  'stargazing_100shots.mp4': require('@/assets/videos/stargazing_100shots.mp4'),
  // Add more videos here as needed
};

interface ProductVideoProps {
  videoUrl?: string;
}

export function ProductVideo({ videoUrl }: ProductVideoProps) {
  if (!videoUrl) return null;

  const getVideoSource = () => {
    // Extract filename from full path (e.g., "videos/Double_horror_36_shot.mp4" -> "Double_horror_36_shot.mp4")
    const filename = videoUrl.split('/').pop();
    const required = filename ? videoAssets[filename] : null;

    if (required) {
      return required;
    }

    // Fallback to URI
    console.log('Using URI fallback for video:', videoUrl);
    return { uri: videoUrl };
  };

  const player = useVideoPlayer(getVideoSource(), player => {
    player.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="contain"
      nativeControls
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ProductVideo;