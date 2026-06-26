import { Image } from 'expo-image';
import { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Text } from 'react-native';

// Map image file paths to require statements for local assets
const imageAssets: Record<string, any> = {
  'coming_soon_flame.jpg': require('@/assets/images/fireworks/coming_soon_flame.jpg'),
  '2_min_flashing_thunder.png': require('@/assets/images/fireworks/2_min_flashing_thunder.png'),
  '300_max_missiles.png': require('@/assets/images/fireworks/300_max_missiles.png'),
  '50_cal.png': require('@/assets/images/fireworks/50_cal.png'),
  '5_ball.png': require('@/assets/images/fireworks/5_ball.png'),
  '750_happy_colorful_missiles.png': require('@/assets/images/fireworks/750_happy_colorful_missiles.png'),
  'adult_snaps.png': require('@/assets/images/fireworks/adult_snaps.png'),
  'air_jordan.png': require('@/assets/images/fireworks/air_jordan.png'),
  'amped.png': require('@/assets/images/fireworks/amped.png'),
  'bigfoot.png': require('@/assets/images/fireworks/bigfoot.png'),
  'blue_thunder.png': require('@/assets/images/fireworks/blue_thunder.png'),
  'bring_it_home.png': require('@/assets/images/fireworks/bring_it_home.png'),
  'caution_high_voltage.png': require('@/assets/images/fireworks/caution_high_voltage.png'),
  'celebrate_america.png': require('@/assets/images/fireworks/celebrate_america.png'),
  'celebrate_freedom.png': require('@/assets/images/fireworks/celebrate_freedom.png'),
  'corn_flakes.png': require('@/assets/images/fireworks/corn_flakes.png'),
  'crazy_contraband.png': require('@/assets/images/fireworks/crazy_contraband.png'),
  'dinosaur_madness.png': require('@/assets/images/fireworks/dinosaur_madness.png'),
  'double_horror.png': require('@/assets/images/fireworks/double_horror.png'),
  'fireworks_16000.png': require('@/assets/images/fireworks/fireworks_16000.png'),
  'freedom_rising.png': require('@/assets/images/fireworks/freedom_rising.png'),
  'game_over.png': require('@/assets/images/fireworks/game_over.png'),
  'gatlin_gun.png': require('@/assets/images/fireworks/gatlin_gun.png'),
  'godzilla.png': require('@/assets/images/fireworks/godzilla.png'),
  'godzilla_vs_kong.png': require('@/assets/images/fireworks/godzilla_vs_kong.png'),
  'gold_24k.png': require('@/assets/images/fireworks/gold_24k.png'),
  'hall_of_fame.png': require('@/assets/images/fireworks/hall_of_fame.png'),
  'heavy_ordnance.png': require('@/assets/images/fireworks/heavy_ordnance.png'),
  'home_run.png': require('@/assets/images/fireworks/home_run.png'),
  'kush.png': require('@/assets/images/fireworks/kush.png'),
  'little_falutini.png': require('@/assets/images/fireworks/little_falutini.png'),
  'merican.png': require('@/assets/images/fireworks/merican.png'),
  'p_fkn_r.png': require('@/assets/images/fireworks/p_fkn_r.png'),
  'printing_money.png': require('@/assets/images/fireworks/printing_money.png'),
  'problem_child.png': require('@/assets/images/fireworks/problem_child.png'),
  'red_blue_mine.png': require('@/assets/images/fireworks/red_blue_mine.png'),
  'redneck_essentials.png': require('@/assets/images/fireworks/redneck_essentials.png'),
  'royal_influencer.png': require('@/assets/images/fireworks/royal_influencer.png'),
  'saso.png': require('@/assets/images/fireworks/saso.png'),
  'scream_machine.png': require('@/assets/images/fireworks/scream_machine.png'),
  'southern_gator.png': require('@/assets/images/fireworks/southern_gator.png'),
  'speed_trap.png': require('@/assets/images/fireworks/speed_trap.png'),
  'stoner.png': require('@/assets/images/fireworks/stoner.png'),
  'supreme_warriors.png': require('@/assets/images/fireworks/supreme_warriors.png'),
  'top_secret.png': require('@/assets/images/fireworks/top_secret.png'),
  'toy_ride.png': require('@/assets/images/fireworks/toy_ride.png'),
  'werewolf.png': require('@/assets/images/fireworks/werewolf.png'),
  'wolf_howling_brocade.png': require('@/assets/images/fireworks/wolf_howling_brocade.png'),
  'zombie.png': require('@/assets/images/fireworks/zombie.png'),
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
