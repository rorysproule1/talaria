from enum import Enum


class Distance(Enum):
    FIVE_KM = "5KM"
    TEN_KM = "10KM"
    HALF_MARATHON = "HALF-MARATHON"
    MARATHON = "MARATHON"


class GoalType(Enum):
    DISTANCE = "DISTANCE"
    TIME = "TIME"


class RunsPerWeek(Enum):
    TWO_TO_THREE = "2-3"
    FOUR_TO_FIVE = "4-5"
    SIX_PLUS = "6+"
