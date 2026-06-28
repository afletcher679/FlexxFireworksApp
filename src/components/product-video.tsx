// product-video.tsx - Video player component for displaying product demo videos
// Handles video source resolution from local assets or remote URIs

import { useEvent } from "expo";
import { SymbolView } from "expo-symbols";
import { VideoView, useVideoPlayer } from "expo-video";
import { Pressable, StyleSheet, View } from "react-native";

// Map video file paths to require statements for local assets
const videoAssets: Record<string, any> = {
  "2_min.mp4": require("../../assets/videos/2_min.mp4"),
  "300_max.mp4": require("../../assets/videos/300_max.mp4"),
  "50_cal.mp4": require("../../assets/videos/50_cal.mp4"),
  "750_happy.mp4": require("../../assets/videos/750_happy.mp4"),
  "adult_snaps.mp4": require("../../assets/videos/adult_snaps.mp4"),
  "air_jordan.mp4": require("../../assets/videos/air_jordan.mp4"),
  "amped.mp4": require("../../assets/videos/amped.mp4"),
  "bigfoot.mp4": require("../../assets/videos/bigfoot.mp4"),
  "barbie.mp4": require("../../assets/videos/barbie.mp4"),
  "blue_thunder.mp4": require("../../assets/videos/blue_thunder.mp4"),
  "bring_it_home.mp4": require("../../assets/videos/bring_it_home.mp4"),
  "caution.mp4": require("../../assets/videos/caution.mp4"),
  "celebrate_america.mp4": require("../../assets/videos/celebrate_america.mp4"),
  "celebrate_freedom.mp4": require("../../assets/videos/celebrate_freedom.mp4"),
  "corn_flakes.mp4": require("../../assets/videos/corn_flakes.mp4"),
  "crazy_contraband.mp4": require("../../assets/videos/crazy_contraband.mp4"),
  "crazy_jordan.mp4": require("../../assets/videos/crazy_jordan.mp4"),
  "dinosaur.mp4": require("../../assets/videos/dinosaur.mp4"),
  "double_horror.mp4": require("../../assets/videos/double_horror.mp4"),
  "dragon_blaster.mp4": require("../../assets/videos/dragon_blaster.mp4"),
  "freedom_rising.mp4": require("../../assets/videos/freedom_rising.mp4"),
  "game_over.mp4": require("../../assets/videos/game_over.mp4"),
  "gatlin.mp4": require("../../assets/videos/gatlin.mp4"),
  "goat.mp4": require("../../assets/videos/goat.mp4"),
  "godzilla.mp4": require("../../assets/videos/godzilla.mp4"),
  "godzilla_v_kong.mp4": require("../../assets/videos/godzilla_v_kong.mp4"),
  "good_stuff.mp4": require("../../assets/videos/good_stuff.mp4"),
  "ground_bloom.mp4": require("../../assets/videos/ground_bloom.mp4"),
  "hall_of_fame.mp4": require("../../assets/videos/hall_of_fame.mp4"),
  "heavy_ordnance.mp4": require("../../assets/videos/heavy_ordnance.mp4"),
  "home_run.mp4": require("../../assets/videos/home_run.mp4"),
  "hulk_smash.mp4": require("../../assets/videos/hulk_smash.mp4"),
  "king_cracker.mp4": require("../../assets/videos/king_cracker.mp4"),
  "lit_dynamite.mp4": require("../../assets/videos/lit_dynamite.mp4"),
  "kush.mp4": require("../../assets/videos/kush.mp4"),
  "Liberation_Day_300_shot.mp4": require("../../assets/videos/Liberation_Day_300_shot.mp4"),
  "little_falutini.mp4": require("../../assets/videos/little_falutini.mp4"),
  "loaded.mp4": require("../../assets/videos/loaded.mp4"),
  "merican.mp4": require("../../assets/videos/merican.mp4"),
  "need_for_speed.mp4": require("../../assets/videos/need_for_speed.mp4"),
  "p_fkn_r.mp4": require("../../assets/videos/p_fkn_r.mp4"),
  "printing_money.mp4": require("../../assets/videos/printing_money.mp4"),
  "problem_child.mp4": require("../../assets/videos/problem_child.mp4"),
  "red_blue_mine.mp4": require("../../assets/videos/red_blue_mine.mp4"),
  "redneck.mp4": require("../../assets/videos/redneck.mp4"),
  "saso.mp4": require("../../assets/videos/saso.mp4"),
  "scream_machine.mp4": require("../../assets/videos/scream_machine.mp4"),
  "smurf_nuts.mp4": require("../../assets/videos/smurf_nuts.mp4"),
  "southern_gator.mp4": require("../../assets/videos/southern_gator.mp4"),
  "speed_trap.mp4": require("../../assets/videos/speed_trap.mp4"),
  "stage_1.mp4": require("../../assets/videos/stage_1.mp4"),
  "stargazing.mp4": require("../../assets/videos/stargazing.mp4"),
  "stoner.mp4": require("../../assets/videos/stoner.mp4"),
  "stop.mp4": require("../../assets/videos/stop.mp4"),
  "supreme_warriors.mp4": require("../../assets/videos/supreme_warriors.mp4"),
  "thumper.mp4": require("../../assets/videos/thumper.mp4"),
  "thunder_king.mp4": require("../../assets/videos/thunder_king.mp4"),
  "top_secret.mp4": require("../../assets/videos/top_secret.mp4"),
  "toy_ride.mp4": require("../../assets/videos/toy_ride.mp4"),
  "up_away.mp4": require("../../assets/videos/up_away.mp4"),
  "witch.mp4": require("../../assets/videos/witch.mp4"),
  "werewolf.mp4": require("../../assets/videos/werewolf.mp4"),
  "wolf_howling.mp4": require("../../assets/videos/wolf_howling.mp4"),
  "zombie.mp4": require("../../assets/videos/zombie.mp4"),
};

function getVideoSource(videoUrl: string) {
  // Extract filename from full path (e.g., "videos/Double_horror_36_shot.mp4" -> "Double_horror_36_shot.mp4")
  const filename = videoUrl.split("/").pop();
  const required = filename ? videoAssets[filename] : null;

  if (required) {
    return required;
  }
  // Fallback to URI
  return { uri: videoUrl };
}

interface ProductVideoProps {
  videoUrl?: string;
  /**
   * When true, shows native player controls (including fullscreen).
   * Default: true.
   */
  useNativeControls?: boolean;
}
export function ProductVideo({
  videoUrl,
  useNativeControls = true,
}: ProductVideoProps) {
  // ✅ Hook called unconditionally BEFORE any return
  const player = useVideoPlayer(
    videoUrl ? getVideoSource(videoUrl) : null,
    (player) => {
      player.loop = false;
    },
  );
  // Track play state reactively so we can show/hide the play overlay.
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // ✅ Conditional return AFTER hook
  if (!videoUrl) return null;

  const handleTap = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // IMPORTANT: every wrapper in the chain must have a CONCRETE size. The old
  // bug was an *unstyled* Pressable + VideoView height:"100%", which collapsed
  // to 0px. Here the Pressable (and View) fill the container, so tap works AND
  // the video is visible.

  if (useNativeControls) {
    return (
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.fill}
          contentFit="contain"
          nativeControls
          fullscreenOptions={{ enable: true }}
          allowsPictureInPicture={false}
        />
      </View>
    );
  }
  return (
    <Pressable style={styles.container} onPress={handleTap}>
      {/* pointerEvents="none" lets the Pressable receive taps, not the video */}
      <VideoView
        player={player}
        style={styles.fill}
        contentFit="contain"
        nativeControls={false}
        allowsPictureInPicture={false}
        pointerEvents="none"
      />

      {/* Play overlay shown only while paused */}
      {!isPlaying && (
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.playBadge}>
            <SymbolView
              name={{
                ios: "play.fill",
                android: "play_arrow",
                web: "play_arrow",
              }}
              size={28}
              tintColor="#fff"
            />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9, // gives the box a real height derived from its width
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  fill: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  playBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductVideo;
