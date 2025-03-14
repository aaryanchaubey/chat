interface CooldownState {
  count: number;
  lastDeleteTime: number;
}

export class DeleteCooldownManager {
  private cooldowns = new Map<string, CooldownState>();
  private readonly MAX_DELETES = 10;
  private readonly COOLDOWN_DURATION = 2 * 60 * 1000; // 2 minutes

  validateDeleteRequest(userId: string): void {
    const cooldown = this.getCooldownState(userId);
    const now = Date.now();

    if (now - cooldown.lastDeleteTime >= this.COOLDOWN_DURATION) {
      cooldown.count = 0;
    }

    if (cooldown.count >= this.MAX_DELETES) {
      const remainingTime = Math.ceil((this.COOLDOWN_DURATION - (now - cooldown.lastDeleteTime)) / 1000);
      throw new Error(`Delete limit reached. Please wait ${remainingTime} seconds.`);
    }
  }

  recordDeletion(userId: string): void {
    const cooldown = this.getCooldownState(userId);
    this.cooldowns.set(userId, {
      count: cooldown.count + 1,
      lastDeleteTime: Date.now()
    });
  }

  private getCooldownState(userId: string): CooldownState {
    return this.cooldowns.get(userId) || { count: 0, lastDeleteTime: 0 };
  }
}