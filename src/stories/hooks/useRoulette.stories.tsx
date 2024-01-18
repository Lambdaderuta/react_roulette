import { useRef, useEffect, ReactElement } from 'react'
import { css, styled } from 'styled-components'
import type { Meta, StoryObj } from '@storybook/react'

import useRoulette from '~/hooks/useRoulette'

import weapons from '~/assets/weapons.json'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'hooks/useRoullete',
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    backgrounds: {
      default: 'black',
      values: [
        {
          name: 'black',
          value: '#1a1b22',
        },
      ],
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof useRoulette>

export default meta
type Story = StoryObj<typeof meta>

interface Weapon {
  weapon_name: string
  skin_name: string
  rarity: Rarity
  steam_image: string
}

enum Rarity {
  Milspec = 'milspec',
  Restricted = 'restricted',
  Classified = 'classified',
  Covert = 'covert ',
  Rare = 'rare',
  Uncommon = 'uncommon',
}

const UseRouletteStory = () => {
  const spinContainerRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { slots, spin, isSpinning: _, isSpinEnd: __, transitionEndHandler } = useRoulette<Weapon>({
    spinContainerRef,
    containerRef,
    items: weapons as Weapon[],
    winner: weapons[3] as Weapon,
    transitionDuration: 5,
    itemWidth: 200,
    virtualItemsCount: 100,
  })

  useEffect(
    () => {
      spin()
    },
    [spin],
  )

  const getSlides = (data: Weapon[]) => data.map(({ steam_image, skin_name, rarity }, i): ReactElement => (
    <StyledSlide key={i}>
      <StyledWeapon rarity={rarity}>
        <StyledWeaponImage src={steam_image} alt="" />
        <StyledTitle>
          {skin_name}
        </StyledTitle>
      </StyledWeapon>
    </StyledSlide>
  ))

  return (
    <StyledPage>
      <StyledContainerOuter ref={containerRef}>
        <StyledContainerInner ref={spinContainerRef} onTransitionEnd={transitionEndHandler}>
          {getSlides(slots)}
        </StyledContainerInner>
      </StyledContainerOuter>
    </StyledPage>
  )
}

export const UseRoulette: Story = {
  render: () => <UseRouletteStory />,
}

const StyledPage = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledContainerOuter = styled.div`
  position: relative;
  width: 1400px;
  margin: 0 auto;
  overflow: hidden;

  &:before {
    content: '';
    background: red;
    display: block;
    position: absolute;
    height: 100%;
    width: 2px;
    left: 50%;
    top: 0;
    z-index: 5;
  }
`

const StyledContainerInner = styled.div`
    display: flex;
    position: relative;
    left: 0;
`

const StyledSlide = styled.div`
  width: 200px;
  height: 200px;
  flex-shrink: 0;
`

const StyledWeapon = styled.div<{ rarity: Rarity }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #282c36;
  position: relative;

  &:before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 5px;

    ${({ rarity }) => {
        switch (rarity) {
            case Rarity.Milspec:
                return css`
                    background: #4b69ff;
                `
            case Rarity.Restricted:
                return css`
                    background: #8847ff;
                `
            case Rarity.Classified:
                return css`
                    background: #d32ce6;
                `
            case Rarity.Covert:
                return css`
                    background: #eb4b4b;
                `
            case Rarity.Rare:
                return css`
                    background: #ffd700;
                `
            case Rarity.Uncommon:
                return css`
                    background: #ddd;
                `
            default:
                return css`
                    background: rgba(255, 255, 255, 0.5);
                `
        }
    }}
  }
`

const StyledWeaponImage = styled.img`
  width: 120px;
  height: 90px;
`

const StyledTitle = styled.p`
  height: 15px;
  line-height: 15px;
  color: #e4e4e4;
  font-size: 12px;
  margin: 0;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
