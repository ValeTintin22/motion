import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private gyroListener?: PluginListenerHandle;
  private motionData: MotionData = {
    acceleration: { x: 0, y: 0, z: 0 },
    rotation: { alpha: 0, beta: 0, gamma: 0 }
  };

  constructor() {}

  async startMotionDetection(callback: (data: MotionData) => void) {
    this.accelListener = await Motion.addListener('accel', (event) => {
      this.motionData = {
        ...this.motionData,
        acceleration: event.acceleration
      };
      callback(this.motionData);
    });

    this.gyroListener = await Motion.addListener('orientation', (event) => {
      this.motionData = {
        ...this.motionData,
        rotation: {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        }
      };
      callback(this.motionData);
    });
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
      this.accelListener = undefined;
    }
    if (this.gyroListener) {
      await this.gyroListener.remove();
      this.gyroListener = undefined;
    }
  }
}

