import * as THREE from 'three'
import { BLOOM_LAYER, STAR_MAX, STAR_MIN } from '../config/renderConfig.js'
import { starTypes } from '../config/starDistributions.js'
import { clamp } from '../shaders/utils.js'

const texture = new THREE.TextureLoader().load('../resources/sprite120.png')
const materials = starTypes.color.map((color) => new THREE.SpriteMaterial({map: texture, color: color}))

export class Star {

    constructor(position) {
        this.position = position
        this.starType = this.generateStarType()
        this.pulseOffset = Math.random() * Math.PI * 2
        this.obj = null
    }

    generateStarType() {
        let num = Math.random() * 100.0
        let pct = starTypes.percentage
        for (let i = 0; i < pct.length; i++) {
            num -= pct[i]
            if (num < 0) {
                return i
            }
        }
        return 0
    }

    updateScale(camera, elapsedTime) {
        let dist = this.position.distanceTo(camera.position) / 250

        // update star size
        let starSize = dist * starTypes.size[this.starType]
        const pulse = 1.0 + Math.sin(elapsedTime + this.pulseOffset) * 0.03
        starSize = clamp(starSize * pulse, STAR_MIN, STAR_MAX)
        this.obj?.scale.copy(new THREE.Vector3(starSize, starSize, starSize))
    }

    toThreeObject(scene) {
        let sprite = new THREE.Sprite(materials[this.starType])
        sprite.layers.set(BLOOM_LAYER)
        
        sprite.scale.multiplyScalar(starTypes.size[this.starType])
        sprite.position.copy(this.position)

        this.obj = sprite

        scene.add(sprite)
    }
}