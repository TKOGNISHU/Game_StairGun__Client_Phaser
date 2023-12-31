import type { Home } from '@/scenes'
import type PrepareDuel from '@/scenes/BootGame/prepareDuel'
import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import FETCH from '@/services/http-https/fetchConfig.service'
import { useMainStore } from '@/stores'
import { createAnimation, initKeyAnimation } from '@/util/shares'
import faceConfig from '@/assets/configs/face.json'
import bodyConfig from '@/assets/configs/face.json'
import footConfig from '@/assets/configs/face.json'

export const CONSTANT = {
    scene: {
        key: 'character-show',
    },
    textureNotFound: '__MISSING',
    sprites: {
        face: {
            key: 'face.default',
            config: 'src/assets/configs/face.json',
            img: 'src/assets/img/equips/faces/face.default.png',
        },
        body: {
            key: 'body.default',
            config: 'src/assets/configs/body.json',
            img: 'src/assets/img/equips/bodies/body.default.png',
        },
        foot: {
            key: 'foot.default',
            config: 'src/assets/configs/foot.json',
            img: 'src/assets/img/equips/foots/foot.default.png',
        },
    },
    deeps: {
        face: 3,
        body: 2,
        foot: 1,
    },
    active: 'show',
}

export default class ShowCharacter extends Phaser.Scene {
    private configs: { [key: string]: any } = {
        face: faceConfig,
        body: bodyConfig,
        foot: footConfig,
    }
    private sprite: {
        [key: string]: Phaser.GameObjects.Sprite | undefined
        face?: Phaser.GameObjects.Sprite
        body?: Phaser.GameObjects.Sprite
        foot?: Phaser.GameObjects.Sprite
    } = { face: undefined, body: undefined, foot: undefined }

    private keysShow: { [key: string]: string } = {}
    constructor() {
        super(CONSTANT.scene)
    }

    init() {
        // this.gameObject = mainStore.getGame.scene.getScene(CONSTANT_HOME.key.home)
    }

    preload() {
        const mainStore: any = useMainStore()
        const looks: { [key: string]: string } = mainStore.getPlayer.looks
        // console.log(looks)

        const objsSpriteConfig: any = CONSTANT.sprites
        // load default and current display
        // console.log('Config default: ', this.configs)
        for (const key in objsSpriteConfig) {
            if (objsSpriteConfig.hasOwnProperty(key)) {
                const element = objsSpriteConfig[key]
                this.load.atlas(element.key, element.img, this.configs[key])
                // console.log(element.key)
                this.keysShow[key] = element.key
                if (looks[key]) {
                    this.keysShow[key] = looks[key]
                    this.load.atlas(looks[key], looks[key], this.configs[key])
                }
            }
        }

        // const dataObj: any = CONSTANT.sprites
        // for (const key in dataObj) {
        //     if (dataObj.hasOwnProperty(key)) {
        //         const element = dataObj[key]

        //         this.textures.addAtlas(
        //             element.key,
        //             this.gameObject.textures.get(element.key).getSourceImage(),
        //             // this.gameObject.textures.get(CONSTANT.key.face), -> error
        //             JSON.parse(localStorage.getItem(element.key)!),
        //         )
        //         // this.anims.createFromAseprite()

        //         // this.keys.push(element.key)
        //     }
        // }
    }

    create() {
        const configs: { [key: string]: any } = this.configs
        for (const key in configs) {
            if (Object.prototype.hasOwnProperty.call(configs, key)) {
                const config: { [key: string]: any } = configs[key]
                // console.log(config)
                const anim = createAnimation(this, config.meta.name, config.animations)
                // console.log(anim)
            }
        }
        // const dataObj: any = CONSTANT.sprites
        const mainStore: any = useMainStore()
        const looks: any = mainStore.getPlayer.looks
        for (const type in looks) {
            if (looks.hasOwnProperty(type)) {
                const src = looks[type]
                this.changeDisplay(type, src)
            }
        }
        console.log('Create show character successfully')
    }

    changeDisplay(type: string, key?: string) {
        // console.log('type: ', type, ', new Key: ', key)
        if (!CONSTANT.sprites.hasOwnProperty(type)) return
        if (!key || key.length === 0) {
            this.keysShow[type] = (CONSTANT.sprites as any)[type].key
            this.changeSprite(type, this.keysShow[type])
            return
        }
        const texture = this.textures.get(key)
        // console.log(texture)
        if (texture.key === CONSTANT.textureNotFound) {
            // console.log('texture not found, loading...')
            this.load.atlas(key, key, this.configs[type])
            this.load.once('complete', () => {
                // console.log('load new texture successfully')
                this.changeSprite(type, key)
            })
            this.load.start()
            return
        }
        // console.log('texture found! Adding...')

        this.changeSprite(type, key)
    }

    changeSprite(type: string, key: string) {
        if (!!this.sprite[type]) this.sprite[type]!.destroy()
        this.sprite[type] = this.add.sprite(0, 0, key).setOrigin(0, 0)
        const deeps: Record<string, number> = CONSTANT.deeps
        this.sprite[type]?.setDepth(deeps[type])
    }

    rerender() {
        console.log('Rerendering')
        // this.scene.restart()
    }
}
