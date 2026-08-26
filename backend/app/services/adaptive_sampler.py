import random
from collections import deque
from typing import Tuple
from ..config import settings

class AdaptiveSampler:
    def __init__(self, window_size: int = 30):
        self.window_size = window_size
        self.recent_outcomes = deque(maxlen=window_size)  # True = Anomaly/Flagged, False = Clean Safe
        self.base_rate = settings.BASE_SAMPLING_RATE
        self.trigger_threshold = settings.ANOMALY_TRIGGER_THRESHOLD
        self.spike_rate = settings.SPIKE_SAMPLING_RATE

    def record_outcome(self, is_flagged: bool):
        self.recent_outcomes.append(is_flagged)

    def get_current_anomaly_rate(self) -> float:
        if not self.recent_outcomes:
            return 0.0
        return sum(1 for x in self.recent_outcomes if x) / len(self.recent_outcomes)

    def calculate_sampling_rate(self) -> Tuple[float, bool]:
        anomaly_rate = self.get_current_anomaly_rate()
        
        # If anomaly rate is higher than threshold, dynamically climb
        if anomaly_rate >= self.trigger_threshold:
            # Scale smoothly from base_rate to spike_rate based on severity
            factor = min((anomaly_rate - self.trigger_threshold) / 0.30, 1.0)
            current_rate = self.base_rate + factor * (self.spike_rate - self.base_rate)
            return round(current_rate * 100, 1), True
        
        return round(self.base_rate * 100, 1), False

    def should_sample_for_judge(self, force_sample: bool = False) -> Tuple[bool, float, bool]:
        if force_sample:
            rate_pct, is_adaptive = self.calculate_sampling_rate()
            return True, rate_pct, is_adaptive

        rate_pct, is_adaptive = self.calculate_sampling_rate()
        sample_decision = (random.random() * 100) < rate_pct
        return sample_decision, rate_pct, is_adaptive

adaptive_sampler = AdaptiveSampler()
