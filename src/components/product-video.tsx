// product-video.tsx - Video player component for displaying product demo videos
// Handles video source resolution from local assets or remote URIs

import { Pressable } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { StyleSheet } from 'react-native';

// Map video file paths to require statements for local assets
const videoAssets: Record<string, any> = {
  '300_max.mp4': require('@/assets/videos/300_max.mp4'),
  '50_cal.mp4': require('@/assets/videos/50_cal.mp4'),
  '750_happy.mp4': require('@/assets/videos/750_happy.mp4'),
  'bigfoot.mp4': require('@/assets/videos/bigfoot.mp4'),
  'bring_it_home.mp4': require('@/assets/videos/bring_it_home.mp4'),
  'caution.mp4': require('@/assets/videos/caution.mp4'),
  'celebrate_america.mp4': require('@/assets/videos/celebrate_america.mp4'),
  'celebrate_freedom.mp4': require('@/assets/videos/celebrate_freedom.mp4'),
  'corn_flakes.mp4': require('@/assets/videos/corn_flakes.mp4'),
  'crazy_contraband.mp4': require('@/assets/videos/crazy_contraband.mp4'),
  'dinosaur.mp4': require('@/assets/videos/dinosaur.mp4'),
  'double_horror.mp4': require('@/assets/videos/double_horror.mp4'),
  'freedom_rising.mp4': require('@/assets/videos/freedom_rising.mp4'),
  'game_over.mp4': require('@/assets/videos/game_over.mp4'),
  'godzilla.mp4': require('@/assets/videos/godzilla.mp4'),
  'godzilla_v_kong.mp4': require('@/assets/videos/godzilla_v_kong.mp4'),
  'hall_of_fame.mp4': require('@/assets/videos/hall_of_fame.mp4'),
  'heavy_ordnance.mp4': require('@/assets/videos/heavy_ordnance.mp4'),
  'Kush_66_shot.mp4': require('@/assets/videos/Kush_66_shot.mp4'),
  'Liberation_Day_300_shot.mp4': require('@/assets/videos/Liberation_Day_300_shot.mp4'),
  'little_falutini.mp4': require('@/assets/videos/little_falutini.mp4'),
  'merican.mp4': require('@/assets/videos/merican.mp4'),
  'p_fkn_r.mp4': require('@/assets/videos/p_fkn_r.mp4'),
  'printing_money.mp4': require('@/assets/videos/printing_money.mp4'),
  'problem_child.mp4': require('@/assets/videos/problem_child.mp4'),
  'red_blue_mine.mp4': require('@/assets/videos/red_blue_mine.mp4'),
  'redneck.mp4': require('@/assets/videos/redneck.mp4'),
  'saso.mp4': require('@/assets/videos/saso.mp4'),
  'scream_machine.mp4': require('@/assets/videos/scream_machine.mp4'),
  'southern_gator.mp4': require('@/assets/videos/southern_gator.mp4'),
  'stage_1_49_shots.mp4': require('@/assets/videos/stage_1_49_shots.mp4'),
  'stargazing_100shots.mp4': require('@/assets/videos/stargazing_100shots.mp4'),
  'stoner.mp4': require('@/assets/videos/stoner.mp4'),
  'supreme_warriors.mp4': require('@/assets/videos/supreme_warriors.mp4'),
  'top_secret.mp4': require('@/assets/videos/top_secret.mp4'),
  'toy_ride.mp4': require('@/assets/videos/toy_ride.mp4'),
  'werewolf.mp4': require('@/assets/videos/werewolf.mp4'),
  'wolf_howling.mp4': require('@/assets/videos/wolf_howling.mp4'),
  'zombie.mp4': require('@/assets/videos/zombie.mp4'),
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

  const handleVideoTap = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <Pressable onPress={handleVideoTap}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls
      />
    </Pressable>
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