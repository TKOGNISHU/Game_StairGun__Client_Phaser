import StairGame from './stairGame'
import GunGame from './gunGame'
import { useMainStore } from '@/stores'
import FETCH from '@/services/http-https/fetchConfig.service'
import CONSTANT_HOME from '../Home/CONSTANT'
import matchService from '@/services/socket/match.service'
import BaseScene from '../baseScene'
import { gunService } from '@/services/socket'
import type { IGameEnd } from '@/util/interface/index.interface'

class GamePlay extends BaseScene {
    public numOfLoaded: number = 0
    public maxLoaded: number = 2

    // private dataGame: IMatchRes | null = null
    private loadings: Array<any> = []
    constructor() {
        super('game-play-scene')
    }

    getLoading(): Array<any> {
        return this.loadings || []
    }

    init() {
        //{ data }: { data: IMatchRes }
        // console.log('data game: ', data)
        // this.dataGame = data
        // const mainStore = useMainStore()
        // mainStore.setMatch(data)
    }

    async preload() {
        console.log('%c\nLoading Game Play...\n', 'color: yellow; font-size: 16px;')
        const mainStore: any = useMainStore()
        this.load.spritesheet(CONSTANT_HOME.loading.key, CONSTANT_HOME.loading.src, {
            frameWidth: 159,
            frameHeight: 308,
        })

        // CardService.getAll().then((allCard: Array<ICard>) => {
        //     console.log('All card: ', allCard)
        //     for (const card of allCard) {
        //         this.load.image(card._id, card.src)
        //     }
        // })

        const configStick: IStickAnimationConfig = JSON.parse(
            await FETCH(mainStore.getMatch!.stickConfig),
        )

        // const maps = mainStore.getMatch!.mapConfigs.reduce(
        //     (objMaps: { [key: string]: any }, e: any) => {
        //         objMaps[e.data.name] = e.data.src
        //         return objMaps
        //     },
        //     {},
        // )
        // for (const key in maps) {
        //     if (Object.prototype.hasOwnProperty.call(maps, key)) {
        //         const tiledMap = JSON.parse(await FETCH(maps[key]))
        //         mainStore.setMapDataJSON(key, tiledMap)
        //     }
        // }

        mainStore.setPropertyMatch({
            stickConfig: JSON.stringify(configStick),
        })

        this.scene.add(CONSTANT_HOME.key.stairGame, StairGame, true, {
            players: mainStore.getMatch!.players,
        })

        console.log('%cLoaded!', 'color: red; font-size: 16px;')
        this.scene.add(CONSTANT_HOME.key.gunGame, GunGame, true)
    }

    create() {
        const mainStore: any = useMainStore()
        const w = mainStore.getWidth * mainStore.getZoom
        const h = mainStore.getHeight * mainStore.getZoom

        const rect = this.add.rectangle(0, 0, w, h, 0xffffff, 0.2).setOrigin(0)
        const loading = this.add.sprite(w / 2, h / 2, CONSTANT_HOME.loading.key)
        this.anims.create({
            key: CONSTANT_HOME.loading.key + '--animation',
            frames: this.anims.generateFrameNumbers(CONSTANT_HOME.loading.key, {
                start: 0,
                end: 4,
            }),
            frameRate: 6,
            repeat: -1,
        })
        loading.anims.play(CONSTANT_HOME.loading.key + '--animation')
        this.loadings.push(rect)
        this.loadings.push(loading)
        console.log('%c\nCreate Game Play...\n', 'color: red; font-size: 16px;')

        this.listeningSocket()
    }

    update(time: number, delta: number) {
        // console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;')
    }

    loaded() {
        this.numOfLoaded += 1
        console.log(this.numOfLoaded)

        if (this.numOfLoaded < this.maxLoaded) return
        matchService.loaded()
    }

    playGame() {
        this.getLoading().forEach((child) => child.setVisible(false))
        let stairGame = this.game.scene.getScene('stair-game') as any
        if (!stairGame) {
            stairGame = this.game.scene.getScene(CONSTANT_HOME.key.stairGame) as any
        }
        stairGame.createGameObject(true)
        let gunGame = this.game.scene.getScene('gun-game') as any
        if (!gunGame) {
            gunGame = this.game.scene.getScene(CONSTANT_HOME.key.gunGame) as any
        }
        gunGame.createGameObject(true)
        console.log('%cPlay!', 'color: red; font-size: 20px')
    }

    // #region listening socket
    listeningSocket() {
        matchService.listeningStartGame(() => this.playGame())
    }
    // #endregion listening socket
}

export default GamePlay
