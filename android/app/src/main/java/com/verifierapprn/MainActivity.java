package com.verifierapprn;

import com.facebook.react.ReactActivity;

import android.media.AudioManager;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import android.view.WindowManager;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "NZ Pass Verifier";
  }

  /**
   * @see https://reactnavigation.org/docs/getting-started/
   * @param savedInstanceState
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(null);
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    this.setVolumeControlStream(AudioManager.STREAM_MUSIC);

    /**
     * Hides the screen on minimise and prevents user taking screenshots
     */
    getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
    );
  }
}
