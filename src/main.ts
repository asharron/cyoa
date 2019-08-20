import { Dungeon } from './Dungeon';
import { Player } from './Player';
import { Menu } from './menu/Menu';


let main = () => {
    let dungeon: Dungeon = new Dungeon('./rooms.yml');
    let player: Player = new Player();
    let menu: Menu = new Menu();
}

main();