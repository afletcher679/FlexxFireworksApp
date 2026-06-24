// Add this new component ABOVE ProductCard, outside of it
import { VideoView, useVideoPlayer } from 'expo-video';
import { StyleSheet } from 'react-native';

export function ProductVideo({ source }: { source: any }) {
  const player = useVideoPlayer(source, player => {
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