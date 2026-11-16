package com.inaam.karobar

import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import org.junit.Rule
import org.junit.Test

class ScreensTest {
    @get:Rule
    val paparazzi = Paparazzi(deviceConfig = DeviceConfig.PIXEL_5, maxPercentDifference = 0.1)

    @Test fun home() = paparazzi.snapshot { AppRoot() }
    @Test fun folder() = paparazzi.snapshot { AppRoot(initialFolder = 4) }
    @Test fun videoIntro() = paparazzi.snapshot { AppRoot(initialVideo = ideas[5].id, videoScene = 0) }
    @Test fun videoMoney() = paparazzi.snapshot { AppRoot(initialVideo = ideas[5].id, videoScene = 1) }
    @Test fun videoStep() = paparazzi.snapshot { AppRoot(initialVideo = ideas[5].id, videoScene = 3) }
    @Test fun videoProfit() = paparazzi.snapshot { AppRoot(initialVideo = ideas[5].id, videoScene = ideas[5].steps.size + 3) }
    @Test fun detail() = paparazzi.snapshot { AppRoot(initialIdea = ideas.first { it.budget == 4 }.id) }
}
