import { Image } from 'expo-image';
import { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Text } from 'react-native';

// Map image file paths to require statements for local assets
const imageAssets: Record<string, any> = {
  'coming_soon_flame.jpg': require('@/assets/images/fireworks/coming_soon_flame.jpg'),
  '2_min_flashing_thunder.jpg': require('@/assets/images/fireworks/2_min_flashing_thunder.jpg'),
  '300_max_missiles.jpg': require('@/assets/images/fireworks/300_max_missiles.jpg'),
  '50_cal.jpg': require('@/assets/images/fireworks/50_cal.jpg'),
  '5_ball.jpg': require('@/assets/images/fireworks/5_ball.jpg'),
  '750_happy_colorful_missiles.jpg': require('@/assets/images/fireworks/750_happy_colorful_missiles.jpg'),
  'adult_snaps.jpg': require('@/assets/images/fireworks/adult_snaps.jpg'),
  'air_jordan.jpg': require('@/assets/images/fireworks/air_jordan.jpg'),
  'amped.jpg': require('@/assets/images/fireworks/amped.jpg'),
  'bigfoot.jpg': require('@/assets/images/fireworks/bigfoot.jpg'),
  'blue_thunder.jpg': require('@/assets/images/fireworks/blue_thunder.jpg'),
  'bring_it_home.jpg': require('@/assets/images/fireworks/bring_it_home.jpg'),
  'caution_high_voltage.jpg': require('@/assets/images/fireworks/caution_high_voltage.jpg'),
  'celebrate_america.jpg': require('@/assets/images/fireworks/celebrate_america.jpg'),
  'celebrate_freedom.jpg': require('@/assets/images/fireworks/celebrate_freedom.jpg'),
  'corn_flakes.jpg': require('@/assets/images/fireworks/corn_flakes.jpg'),
  'crazy_contraband.jpg': require('@/assets/images/fireworks/crazy_contraband.jpg'),
  'crazy_jordan.jpg': require('@/assets/images/fireworks/crazy_jordan.jpg'),
  'dinosaur_madness.jpg': require('@/assets/images/fireworks/dinosaur_madness.jpg'),
  'double_horror.jpg': require('@/assets/images/fireworks/double_horror.jpg'),
  'dragon_blaster.jpg': require('@/assets/images/fireworks/dragon_blaster.jpg'),
  'fireworks_16000.jpg': require('@/assets/images/fireworks/fireworks_16000.jpg'),
  'freak_mvps.jpg': require('@/assets/images/fireworks/freak_mvps.jpg'),
  'freedom_rising.jpg': require('@/assets/images/fireworks/freedom_rising.jpg'),
  'game_over.jpg': require('@/assets/images/fireworks/game_over.jpg'),
  'gatlin_gun.jpg': require('@/assets/images/fireworks/gatlin_gun.jpg'),
  'ghost_buster.jpg': require('@/assets/images/fireworks/ghost_buster.jpg'),
  'godzilla.jpg': require('@/assets/images/fireworks/godzilla.jpg'),
  'godzilla_vs_kong.jpg': require('@/assets/images/fireworks/godzilla_vs_kong.jpg'),
  'gold_24k.jpg': require('@/assets/images/fireworks/gold_24k.jpg'),
  'good_stuff.jpg': require('@/assets/images/fireworks/good_stuff.jpg'),
  'ground_bloom.jpg': require('@/assets/images/fireworks/ground_bloom.jpg'),
  'hall_of_fame.jpg': require('@/assets/images/fireworks/hall_of_fame.jpg'),
  'happy_boom_meal.jpg': require('@/assets/images/fireworks/happy_boom_meal.jpg'),
  'heavy_ordnance.jpg': require('@/assets/images/fireworks/heavy_ordnance.jpg'),
  'home_run.jpg': require('@/assets/images/fireworks/home_run.jpg'),
  'king_cracker.jpg': require('@/assets/images/fireworks/king_cracker.jpg'),
  'kush.jpg': require('@/assets/images/fireworks/kush.jpg'),
  'liberation_day.jpg': require('@/assets/images/fireworks/liberation_day.jpg'),
  'little_falutini.jpg': require('@/assets/images/fireworks/little_falutini.jpg'),
  'merican.jpg': require('@/assets/images/fireworks/merican.jpg'),
  'need_for_speed.jpg': require('@/assets/images/fireworks/need_for_speed.jpg'),
  'p_fkn_r.jpg': require('@/assets/images/fireworks/p_fkn_r.jpg'),
  'printing_money.jpg': require('@/assets/images/fireworks/printing_money.jpg'),
  'problem_child.jpg': require('@/assets/images/fireworks/problem_child.jpg'),
  'red_blue_mine.jpg': require('@/assets/images/fireworks/red_blue_mine.jpg'),
  'redneck_essentials.jpg': require('@/assets/images/fireworks/redneck_essentials.jpg'),
  'rocket_fast.jpg': require('@/assets/images/fireworks/rocket_fast.jpg'),
  'royal_influencer.jpg': require('@/assets/images/fireworks/royal_influencer.jpg'),
  'saso.jpg': require('@/assets/images/fireworks/saso.jpg'),
  'scream_machine.jpg': require('@/assets/images/fireworks/scream_machine.jpg'),
  'smurf_nuts.jpg': require('@/assets/images/fireworks/smurf_nuts.jpg'),
  'southern_gator.jpg': require('@/assets/images/fireworks/southern_gator.jpg'),
  'speed_trap.jpg': require('@/assets/images/fireworks/speed_trap.jpg'),
  'stage_1.jpg': require('@/assets/images/fireworks/stage_1.jpg'),
  'stoner.jpg': require('@/assets/images/fireworks/stoner.jpg'),
  'supreme_warriors.jpg': require('@/assets/images/fireworks/supreme_warriors.jpg'),
  'thumper.jpg': require('@/assets/images/fireworks/thumper.jpg'),
  'thunder_king.jpg': require('@/assets/images/fireworks/thunder_king.jpg'),
  'top_secret.jpg': require('@/assets/images/fireworks/top_secret.jpg'),
  'toy_ride.jpg': require('@/assets/images/fireworks/toy_ride.jpg'),
  'up_away.jpg': require('@/assets/images/fireworks/up_away.jpg'),
  'war_hawk.jpg': require('@/assets/images/fireworks/war_hawk.jpg'),
  'werewolf.jpg': require('@/assets/images/fireworks/werewolf.jpg'),
  'wolf_howling_brocade.jpg': require('@/assets/images/fireworks/wolf_howling_brocade.jpg'),
  'zombie.jpg': require('@/assets/images/fireworks/zombie.jpg'),
};

interface ProductImageProps {
  imageUrl?: string;
}

export function ProductImage({ imageUrl }: ProductImageProps) {
  if (!imageUrl) return null;

  const [isFullscreen, setIsFullscreen] = useState(false);

  const getImageSource = () => {
    // Extract filename from full path (e.g., "assets/images/fireworks/coming_soon_flame.jpg" -> "coming_soon_flame.jpg")
    const filename = imageUrl.split('/').pop();
    const required = filename ? imageAssets[filename] : null;

    if (required) {
      return required;
    }

    // Fallback to URI
    console.log('Using URI fallback for image:', imageUrl);
    return { uri: imageUrl };
  };

  return (
    <>
      <Pressable onPress={() => setIsFullscreen(true)}>
        <View style={styles.imageContainer}>
          <Image source={getImageSource()} style={styles.productImage} contentFit="contain" />
        </View>
      </Pressable>

      <Modal
        visible={isFullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFullscreen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsFullscreen(false)}>
          <View style={styles.modalContent}>
            <Image source={getImageSource()} style={styles.fullscreenImage} contentFit="contain" />
            <Pressable style={styles.closeButton} onPress={() => setIsFullscreen(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
