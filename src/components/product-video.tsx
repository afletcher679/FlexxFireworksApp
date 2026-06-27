// product-video.tsx - Video player component for displaying product demo videos
// Handles video source resolution from local assets or remote URIs

import { Pressable } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { StyleSheet } from 'react-native';

// Map video file paths to require statements for local assets
const videoAssets: Record<string, any> = {
  '2_min.mp4': require('../../assets/videos/2_min.mp4'),
  '300_max.mp4': require('../../assets/videos/300_max.mp4'),
  '50_cal.mp4': require('../../assets/videos/50_cal.mp4'),
  '750_happy.mp4': require('../../assets/videos/750_happy.mp4'),
  'adult_snaps.mp4': require('../../assets/videos/adult_snaps.mp4'),
  'air_jordan.mp4': require('../../assets/videos/air_jordan.mp4'),
  'amped.mp4': require('../../assets/videos/amped.mp4'),
  'bigfoot.mp4': require('../../assets/videos/bigfoot.mp4'),
  'barbie.mp4': require('../../assets/videos/barbie.mp4'),
  'blue_thunder.mp4': require('../../assets/videos/blue_thunder.mp4'),
  'bring_it_home.mp4': require('../../assets/videos/bring_it_home.mp4'),
  'caution.mp4': require('../../assets/videos/caution.mp4'),
  'celebrate_america.mp4': require('../../assets/videos/celebrate_america.mp4'),
  'celebrate_freedom.mp4': require('../../assets/videos/celebrate_freedom.mp4'),
  'corn_flakes.mp4': require('../../assets/videos/corn_flakes.mp4'),
  'crazy_contraband.mp4': require('../../assets/videos/crazy_contraband.mp4'),
  'crazy_jordan.mp4': require('../../assets/videos/crazy_jordan.mp4'),
  'dinosaur.mp4': require('../../assets/videos/dinosaur.mp4'),
  'double_horror.mp4': require('../../assets/videos/double_horror.mp4'),
  'dragon_blaster.mp4': require('../../assets/videos/dragon_blaster.mp4'),
  'freedom_rising.mp4': require('../../assets/videos/freedom_rising.mp4'),
  'game_over.mp4': require('../../assets/videos/game_over.mp4'),
  'gatlin.mp4': require('../../assets/videos/gatlin.mp4'),
  'goat.mp4': require('../../assets/videos/goat.mp4'),
  'godzilla.mp4': require('../../assets/videos/godzilla.mp4'),
  'godzilla_v_kong.mp4': require('../../assets/videos/godzilla_v_kong.mp4'),
  'good_stuff.mp4': require('../../assets/videos/good_stuff.mp4'),
  'ground_bloom.mp4': require('../../assets/videos/ground_bloom.mp4'),
  'hall_of_fame.mp4': require('../../assets/videos/hall_of_fame.mp4'),
  'heavy_ordnance.mp4': require('../../assets/videos/heavy_ordnance.mp4'),
  'home_run.mp4': require('../../assets/videos/home_run.mp4'),
  'king_cracker.mp4': require('../../assets/videos/king_cracker.mp4'),
  'lit_dynamite.mp4': require('../../assets/videos/lit_dynamite.mp4'),
  'Kush_66_shot.mp4': require('../../assets/videos/Kush_66_shot.mp4'),
  'Liberation_Day_300_shot.mp4': require('../../assets/videos/Liberation_Day_300_shot.mp4'),
  'little_falutini.mp4': require('../../assets/videos/little_falutini.mp4'),
  'loaded.mp4': require('../../assets/videos/loaded.mp4'),
  'merican.mp4': require('../../assets/videos/merican.mp4'),
  'need_for_speed.mp4': require('../../assets/videos/need_for_speed.mp4'),
  'p_fkn_r.mp4': require('../../assets/videos/p_fkn_r.mp4'),
  'printing_money.mp4': require('../../assets/videos/printing_money.mp4'),
  'problem_child.mp4': require('../../assets/videos/problem_child.mp4'),
  'red_blue_mine.mp4': require('../../assets/videos/red_blue_mine.mp4'),
  'redneck.mp4': require('../../assets/videos/redneck.mp4'),
  'saso.mp4': require('../../assets/videos/saso.mp4'),
  'scream_machine.mp4': require('../../assets/videos/scream_machine.mp4'),
  'smurf_nuts.mp4': require('../../assets/videos/smurf_nuts.mp4'),
  'southern_gator.mp4': require('../../assets/videos/southern_gator.mp4'),
  'speed_trap.mp4': require('../../assets/videos/speed_trap.mp4'),
  'stage_1_49_shots.mp4': require('../../assets/videos/stage_1_49_shots.mp4'),
  'stargazing_100shots.mp4': require('../../assets/videos/stargazing_100shots.mp4'),
  'stoner.mp4': require('../../assets/videos/stoner.mp4'),
  'stop.mp4': require('../../assets/videos/stop.mp4'),
  'supreme_warriors.mp4': require('../../assets/videos/supreme_warriors.mp4'),
  'thumper.mp4': require('../../assets/videos/thumper.mp4'),
  'thunder_king.mp4': require('../../assets/videos/thunder_king.mp4'),
  'top_secret.mp4': require('../../assets/videos/top_secret.mp4'),
  'toy_ride.mp4': require('../../assets/videos/toy_ride.mp4'),
  'up_away.mp4': require('../../assets/videos/up_away.mp4'),
  'witch.mp4': require('../../assets/videos/witch.mp4'),
  'werewolf.mp4': require('../../assets/videos/werewolf.mp4'),
  'wolf_howling.mp4': require('../../assets/videos/wolf_howling.mp4'),
  'zombie.mp4': require('../../assets/videos/zombie.mp4'),
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