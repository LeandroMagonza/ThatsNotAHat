# That's Not a Hat!

A digital adaptation of the card game "That's Not a Hat!" that can be played on a single mobile device or computer. This implementation allows multiple players to enjoy the game by passing the device between them during their turns.

## Game Objective

Players give gifts to each other while trying to remember who gave what and which gift they have in front of them. If they can't remember, they have to bluff to avoid a penalty point. The player with the lowest score at the end wins!

## How to Play

1. **Setup**: Enter the names of 3-8 players, set how many seconds cards are shown, and how many penalty points end the game.

2. **Initial Cards**: Each player receives one face-up card that they can see briefly before it's turned face down.

3. **Turn Sequence**:
   - The current player draws a new card from the gift shop (deck)
   - The card is shown briefly, then turned face down
   - The card has an arrow (up or down) indicating which player will receive the gift
   - The current player declares what gift they're giving ("I have a nice ___ for you")
   - The receiving player can accept or reject the gift

4. **Accepting a Gift**:
   - If accepted, the gift is placed face down in front of the receiving player
   - The receiving player then gives their oldest gift to another player

5. **Rejecting a Gift**:
   - If rejected, the gift is revealed
   - If the giver was telling the truth, the receiver gets a penalty point
   - If the giver was lying, the giver gets a penalty point
   - The player who was wrong draws a new gift and immediately gives it to another player

6. **Game End**: The game ends when a player reaches the set number of penalty points. The player with the fewest penalty points wins!

## Implementation Details

This digital adaptation features:

- A setup screen to configure players and game settings
- A game screen showing all players, their points, and cards
- Card reveal modals with timers
- Gift selection from a searchable list
- Accept/Reject decisions
- Result screens showing penalties
- Game over screen with final rankings
- **Visual gift cards with images** for a more immersive experience

## Gift Images

The game automatically scans the `src/assets/gifts/` folder for images to use with the gift cards. To add new gift images:

1. Create a PNG or JPG image of the gift (recommended size: 400x300 pixels)
2. Name the file using lowercase with underscores (e.g., `coffee_mug.png`)
3. Place the file in the `src/assets/gifts/` folder
4. Restart the application

See the [gift images README](src/assets/gifts/README.md) for more details.

## Technologies Used

- React Native / Expo
- TypeScript
- React Hooks for state management
- Dynamic image loading system

## How to Run

1. Install dependencies:
```
npm install
```

2. Start the Expo development server:
```
npm start
```

3. Follow the instructions to run on your device or simulator.

Enjoy the game! 