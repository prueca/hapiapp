export const modelOptions = [
    'Swing-up Freezer',
    'Sliding Glass Freezer',
    'Sliding Curved Glass Freezer',
    'Sliding Curved Glass Freezer - Lighted'
] as const

export const brandOptions = ['Aucma', 'Haier', 'Hiron', 'Liebherr'] as const

export const capacityOptions = [7, 8, 9, 12, 15, 18, 22, 24] as const

export const yearModelOptions = [
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
    2026
] as const

const HOUSED_AVAILABLE = 'housed - available'
const FOR_DEPLOYMENT = 'for deployment'
const DEPLOYED_DESIGNATED = 'deployed - designated'
const FOR_PULLOUT = 'for pullout'
const PULLOUT = 'pullout'
const FOR_REPLACEMENT_BROKEN_UNIT = 'for replacement - broken unit'
const FOR_REPLACEMENT_DOWNGRADE = 'for replacement - downgrade'
const FOR_REPLACEMENT_UPGRADE = 'for replacement - upgrade'

export const freezerStatus = {
    HOUSED_AVAILABLE,
    FOR_DEPLOYMENT,
    DEPLOYED_DESIGNATED,
    FOR_PULLOUT,
    PULLOUT,
    FOR_REPLACEMENT_BROKEN_UNIT,
    FOR_REPLACEMENT_DOWNGRADE,
    FOR_REPLACEMENT_UPGRADE
} as const
