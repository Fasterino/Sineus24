

async function setUpGame() {
    const FpsCaps = {
        NoCap: 0,
        Lock30: 30,
        Lock60: 60,
        Lock120: 120
    };

    const Screen = {
        width: 600,
        height: 900
    };

    const Sounds = {
        Ball: 'ball',
        Bonus: 'bonus',
        Brick: 'brick',
        Hit: 'hit',
        LvlUp: 'level-up',
        Select: 'select',
    };

    const OwnTags = {
        Dino: 'Dino',
        Ball: 'Ball',
        Brick: 'Brick',
        BrickInactive: 'BrickInactive',
        UiBorder: 'UiBorder',
        Platform: DefaultTags.Player
    };

    const BrickTypes = {
        Normal: 'Normal',
        Bonus: 'Bonus',
        Metal: 'Metal'
    };

    const Storage = {
        BestScore: 'arkanoidBestScore',
    };

    const Levels = [
        "            \n" +
        "            \n" +
        "            \n" +
        " ########## \n" +
        " ####++#### \n" +
        " #        # \n" +
        " ####++#### \n" +
        " ####++#### \n" +
        " #        # \n" +
        " ####++#### \n" +
        " ####++#### \n" +
        " #        # \n" +
        " ####++#### \n" +
        " ####++#### \n" +
        " #        # \n" +
        " ####++#### \n" +
        " ########## \n" +
        "            \n",
        "            \n" +
        "            \n" +
        "   #    #   \n" +
        "   #    #   \n" +
        "  #+#  #+#  \n" +
        "  #+#  #+#  \n" +
        "   #    #   \n" +
        "   #    #   \n" +
        "            \n" +
        "            \n" +
        "            \n" +
        "            \n" +
        "            \n" +
        "  #      #  \n" +
        "  @++++++@  \n" +
        "   @@@@@@   \n" +
        "            \n" +
        "            \n",
        "            \n" +
        "            \n" +
        "            \n" +
        " @@@@@@@@@@ \n" +
        " @@@@@@@@@@ \n" +
        " #        # \n" +
        " ##+#++#+## \n" +
        " ##+#++#+## \n" +
        " #        # \n" +
        " ##+#++#+## \n" +
        " ##+#++#+## \n" +
        " #        # \n" +
        " ##+#++#+## \n" +
        " ##+#++#+## \n" +
        " #        # \n" +
        " @@@@@@@@@@ \n" +
        " @@@@@@@@@@ \n" +
        "            \n",
        "##  #  #  ##\n" +
        " #  #  #  # \n" +
        " ##      ## \n" +
        "    @@@@    \n" +
        "##  @@@@  ##\n" +
        " # @####@ # \n" +
        "   @####@   \n" +
        "## @#++#@ ##\n" +
        "   @#++#@   \n" +
        "   @#++#@   \n" +
        "## @#++#@ ##\n" +
        "   @####@   \n" +
        " # @####@ # \n" +
        "##  @@@@  ##\n" +
        "    @@@@    \n" +
        " ##      ## \n" +
        " #  #  #  # \n" +
        "##  #  #  ##\n",
        "            \n" +
        "            \n" +
        "            \n" +
        "            \n" +
        "            \n" +
        "            \n" +
        "@@@      @@@\n" +
        "@##@    @##@\n" +
        "@#+#@  @#+#@\n" +
        " @#+#@@#+#@ \n" +
        "  @#+##+#@  \n" +
        "   @#++#@   \n" +
        "   @#++#@   \n" +
        "  @#+##+#@  \n" +
        " @#+#@@#+#@ \n" +
        "@#+#@  @#+#@\n" +
        "@##@    @##@\n" +
        "@@@      @@@\n",
        "            \n" +
        "            \n" +
        "############\n" +
        "############\n" +
        "#          #\n" +
        "# @@@@@@@@ #\n" +
        "# @@@@@@@@ #\n" +
        "# @      @ #\n" +
        "# @ #### @ #\n" +
        "# @ #++# @ #\n" +
        "# @ #++# @ #\n" +
        "# @ #### @ #\n" +
        "# @      @ #\n" +
        "# @@@@@@@@ #\n" +
        "# @@@@@@@@ #\n" +
        "#          #\n" +
        "############\n" +
        "############\n",
        "            \n" +
        "  ##    ##  \n" +
        " #+##  ##+# \n" +
        " ##+#  #+## \n" +
        "  ##+##+##  \n" +
        "    #++#    \n" +
        "    #++#    \n" +
        "  ##+##+##  \n" +
        " ##+#@@#+## \n" +
        " #+##++##+# \n" +
        "  ##@@@@##  \n" +
        "    +##+    \n" +
        "   @@@@@@   \n" +
        "   +####+   \n" +
        "  @@@@@@@@  \n" +
        "  +######+  \n" +
        " @@@@@@@@@@ \n" +
        " +########+ \n",
        "@@@@@@@@@@@@\n" +
        "@##########@\n" +
        "@#++++++++#@\n" +
        "@#+######+#@\n" +
        "@#+#@@@@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@##@#+#@\n" +
        "@#+#@@@@#+#@\n" +
        "@#+######+#@\n" +
        "@#++++++++#@\n" +
        "@##########@\n" +
        "@@@@@@@@@@@@\n"
    ];

    function getDinoAnimations() {
        let frame = 0;
        function addAnimation(frames, fps = -1, t) {
            const animation = [frame];
            frame += frames;
            animation.push(frame - 1, fps == -1 ? frames : fps, t);
            return animation;
        }
        const animations = {
            IDLE: addAnimation(2, -1, AnimationType.Cycle),
            SWING: addAnimation(6, 12, AnimationType.PingPong),
            GAMEOVER: addAnimation(4, 2, AnimationType.Once),
        }

        animations.FASTSWING = [...animations.SWING];
        animations.FASTSWING[2] *= 10;

        return animations;
    }

    function getBricks() {
        let frame = 0;
        function addType(health = 1) {
            const info = [frame, health];
            frame += health;
            return info;
        }

        return {
            [BrickTypes.Normal]: addType(1),
            [BrickTypes.Bonus]: addType(2),
            [BrickTypes.Metal]: addType(3),
        }
    }

    /**
     * 
     * @param {PixelArtObject} prefab 
     */
    function loadDinoSprites(prefab) {
        prefab.loadArt(
            "                                    \n" +
            "           ##########               \n" +
            "           ##########               \n" +
            "            ## ######               \n" +
            "           ##########               \n" +
            "           ##########               \n" +
            "            #########               \n" +
            " #         ##### # #                \n" +
            " #         #####                    \n" +
            " ##         #### # #                \n" +
            " ###       #########                \n" +
            " ####      #####                    \n" +
            "  #####     ##### ##                \n" +
            "  #################                 \n" +
            "   ##############                   \n" +
            "    ############# ##                \n" +
            "     ##############                 \n" +
            "      ##########                    \n" +
            "        ##   ##                     \n" +
            "        ##   ##                     \n" +
            "        #    #                      \n" +
            "        #    #                      \n" +
            "        ##   ##                     \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "           ##########               \n" +
            "           ##########               \n" +
            "            ## ######               \n" +
            "           ##########               \n" +
            "           ##########               \n" +
            "            #########               \n" +
            " #         ##### # #                \n" +
            " #         #####                    \n" +
            " ##         #### # #                \n" +
            " ###       #########                \n" +
            " ####      #####                    \n" +
            "  #####     ##### ###               \n" +
            "  #################                 \n" +
            "   ##############                   \n" +
            "    ############# ###               \n" +
            "     ##############                 \n" +
            "       #########                    \n" +
            "        ##   ##                     \n" +
            "         #    #                     \n" +
            "        #    #                      \n" +
            "        ##   ##                     \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "             ##########             \n" +
            "             ##########             \n" +
            "              ## ######             \n" +
            "             ##########             \n" +
            "             ##########             \n" +
            "  #           #### # #              \n" +
            "  ##         ##### # #              \n" +
            "  ###        #########              \n" +
            "  #####       #####                 \n" +
            "   ######    ###### ##              \n" +
            "   ##################               \n" +
            "    ###############                 \n" +
            "     ############## ##              \n" +
            "      ###############               \n" +
            "       ##########                   \n" +
            "        ########                    \n" +
            "         ##   ##                    \n" +
            "         #    #                     \n" +
            "         #    #                     \n" +
            "         ##   ##                    \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "              ##########            \n" +
            "              ##########            \n" +
            "               ## ######            \n" +
            "              ##########            \n" +
            "   #          ##########            \n" +
            "   ##          #### # #             \n" +
            "   ###        ##########            \n" +
            "   #####      #########             \n" +
            "   ######      #####                \n" +
            "    ################                \n" +
            "    ###################             \n" +
            "     ###############                \n" +
            "      ##############                \n" +
            "       ################             \n" +
            "        #########                   \n" +
            "         ##   ##                    \n" +
            "         #    #                     \n" +
            "         #    #                     \n" +
            "         ##   ##                    \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "               ##########           \n" +
            "               ##########           \n" +
            "                ## ######           \n" +
            "   #           ##########           \n" +
            "   ##          ##########           \n" +
            "   ###          #### # #            \n" +
            "   #####       ##########           \n" +
            "   ######      #########            \n" +
            "    #######     #####               \n" +
            "    #################               \n" +
            "     #################              \n" +
            "      ############## #              \n" +
            "       #############                \n" +
            "        #########  ###              \n" +
            "         #######     #              \n" +
            "         ##   ##                    \n" +
            "         #    #                     \n" +
            "         ##   ##                    \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "               ##########           \n" +
            "               ##########           \n" +
            "   #            ## ######           \n" +
            "   ##          ##########           \n" +
            "   ###         ##########           \n" +
            "   #####        #########           \n" +
            "   ######      ##########           \n" +
            "    #######    #########            \n" +
            "    #################               \n" +
            "     ###############                \n" +
            "      ################              \n" +
            "       ###########   #              \n" +
            "        ############                \n" +
            "         #######   #                \n" +
            "         ##   ##                    \n" +
            "         #    #                     \n" +
            "         ##   ##                    \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "               ##########           \n" +
            "   #           ##########           \n" +
            "   ##           ## ######           \n" +
            "   ###         ##########           \n" +
            "   #####       ##########           \n" +
            "   #######      #########           \n" +
            "    #######    ##########           \n" +
            "    ####################            \n" +
            "     ###############                \n" +
            "      ###############               \n" +
            "       ###########  #               \n" +
            "        ###########                 \n" +
            "         #######  #                 \n" +
            "         #    #                     \n" +
            "         ##   ##                    \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                ##########          \n" +
            "   #            ##########          \n" +
            "   ##            ## ######          \n" +
            "   ####         ##########          \n" +
            "   ######       ##########          \n" +
            "   ########    ###########          \n" +
            "    ######################          \n" +
            "    #####################           \n" +
            "     #################              \n" +
            "      ###############               \n" +
            "       ###########  #               \n" +
            "        ######## #                  \n" +
            "         #    #                     \n" +
            "         ##   ##                    \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "              ##########            \n" +
            "              ##   #####            \n" +
            "               # # #####            \n" +
            "              ##   #####            \n" +
            "              ##########            \n" +
            "               #########            \n" +
            "    #         ##### # #             \n" +
            "    #         #####                 \n" +
            "    ##         #### # #             \n" +
            "    ###       #########             \n" +
            "    ####      #####                 \n" +
            "     #####     ##### ##             \n" +
            "     #################              \n" +
            "      ##############                \n" +
            "       ############# ##             \n" +
            "        ##############              \n" +
            "         ##########                 \n" +
            "           ##   ##                  \n" +
            "           ##   ##                  \n" +
            "           #    #                   \n" +
            "           #    #                   \n" +
            "           ##   ##                  \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "             ##########             \n" +
            "             ##   #####             \n" +
            "              # # #####             \n" +
            "             ##   #####             \n" +
            "             ##########             \n" +
            "              #########             \n" +
            "   #         ##### # #              \n" +
            "   #         #####                  \n" +
            "   ##         #### # #              \n" +
            "   ###       #########              \n" +
            "   ####      #####                  \n" +
            "    #####   ######                  \n" +
            "    ################                \n" +
            "     #############                  \n" +
            "      ############                  \n" +
            "       #############                \n" +
            "        ##########                  \n" +
            "          ##   ##                   \n" +
            "           #    #                   \n" +
            "           ##   ##                  \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "           ##########               \n" +
            "           ##   #####               \n" +
            "            # # #####               \n" +
            "           ##   #####               \n" +
            "           ##########               \n" +
            "            #########               \n" +
            "  #        ##### # #                \n" +
            "  #        #####                    \n" +
            "  ##        #### # #                \n" +
            "  ###      #########                \n" +
            "  ####     ######                   \n" +
            "   #####  #######                   \n" +
            "   ################                 \n" +
            "    ############# #                 \n" +
            "     ############ #                 \n" +
            "      #############                 \n" +
            "       ##########                   \n" +
            "         ##   ##                    \n" +
            "          ##   ##                   \n" +
            "                                    \n"
        ).addFrame().loadArt(
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "                                    \n" +
            "          ##########                \n" +
            "          ##   #####                \n" +
            "           # # #####                \n" +
            "          ##   #####                \n" +
            "          ##########                \n" +
            "           #########                \n" +
            " #        ##### # #                 \n" +
            " #        #####                     \n" +
            " ##        #### # #                 \n" +
            " ###      #########                 \n" +
            " ####     #######                   \n" +
            "  ###############                   \n" +
            "  ###############                   \n" +
            "   ###############                  \n" +
            "    ##############                  \n" +
            "     ############                   \n" +
            "      ##########  #                 \n" +
            "         #### #####                 \n" +
            "                                    \n"
        )
    }

    const engine = new Engine(Screen.width, Screen.height, FpsCaps.Lock120);
    const toLoad = [engine.loadResources()];
    for (const value of Object.values(Sounds))
        toLoad.push(engine.loadSound(value));
    await Promise.all(toLoad);

    let secondOrHigherAttempt = false, canStart = false, inGame = false;

    const
        dinoAnimations = getDinoAnimations(),
        bricks = getBricks(),
        edgeY = 100,
        platformY = engine.height - edgeY,
        ballOffset = -16,
        speedToAdd = 50,
        startSpeed = 500,
        livesMax = 3,
        ballsMax = 50,
        livesOffsetX = 24,
        livesOffsetY = -2,
        livesEatOffset = 10,
        bonusSpeed = 100,
        scoreMp = 10,

        ballTextPrefab = engine.prefab(engine.createText(), prefab => {
            prefab.setText('?');
            prefab.setSize(15);
        }),
        ballModelPrefab = engine.prefab(engine.createGeometry(ballTextPrefab.size, ballTextPrefab.size), prefab => {
            prefab.circle(.5, .5, .5);
            prefab.onStart = function () {
                this.locals.text = engine.instantiate(ballTextPrefab);
                this.locals.setPos = (x, y) => {
                    this.y = y;
                    this.locals.text.y = this.y + 1;
                    this.locals.text.x = this.x = x;
                };
            };
        }),
        bonuses = {
            minigan: {
                chance: 1,
                letter: 'π',
                logic: () => {
                    engine.instantiate(miniganPrefab);
                }
            },
            addBalls: {
                chance: 60,
                letter: '+',
                logic: () => {
                    const platform = engine.findByTag(OwnTags.Platform);
                    platform.locals.spawnBall([platform.x, platform.y + ballOffset], [-0.5, -0.5]);
                    platform.locals.spawnBall([platform.x, platform.y + ballOffset], [0.5, -0.5]);
                }
            },
            multBalls: {
                chance: 30,
                letter: '×',
                logic: () => {
                    const platform = engine.findByTag(OwnTags.Platform);
                    engine.findAllByTag(OwnTags.Ball).forEach(ball =>
                        platform.locals.spawnBall([ball.x, ball.y], [-ball.locals.dir.x, -ball.locals.dir.y]));
                }
            },
        },
        miniganPrefab = engine.prefab(engine.createText(), prefab => {
            prefab.setText(bonuses.minigan.letter);
            prefab.setSize(30);
            const angle = Math.PI / 6;
            prefab.onStart = function () {
                this.locals.platform = engine.findByTag(OwnTags.Platform);
                this.locals.ammo = ballsMax;
                this.y = this.locals.platform.y - this.locals.platform.height / 2;
                const startY = this.y, endY = this.locals.platform.y + ballOffset;
                this.locals.shoot = () => {
                    if (this.locals.ammo-- == 0 || !this.locals.platform.locals.balls || !this.locals.platform.locals.bricks) {
                        engine.coroutine(250, t => {
                            const easeT = 1 - engine.math.easeInOut(t);
                            this.y = engine.math.lerp(startY, endY, easeT);
                            this.scale = easeT;
                        }, () => {
                            this.destroy();
                        });
                        return;
                    }

                    const pos = Math.floor(this.locals.ammo / 4) % 2 ? (this.locals.ammo % 5) - 2 : 2 - (this.locals.ammo % 5);

                    this.locals.platform.locals.spawnBall([this.x, this.y], [Math.sin(angle * pos), -Math.cos(angle * pos)]);

                    engine.wait(100, () => this.locals.shoot());
                }
                engine.coroutine(250, t => {
                    const easeT = engine.math.easeInOut(t);
                    this.y = engine.math.lerp(startY, endY, easeT);
                    this.scale = easeT;
                }, () => {
                    this.y = endY;
                    this.scale = 1;
                    this.locals.shoot();
                })
            };
            prefab.onUpdate = function () {
                this.x = this.locals.platform.x;
            };
        }),
        bonusPrefab = engine.prefab(ballModelPrefab.clone(), prefab => {
            const chances = [];
            let maxChance = 0;
            for (const key of Object.keys(bonuses)) {
                maxChance += bonuses[key].chance;
                chances.push([key, maxChance]);
            }

            prefab.onStart = engine.override(prefab.onStart, function (_super) {
                _super();
                const curChance = engine.math.randFloat(maxChance);
                let bonus = null;
                for (const [key, chance] of chances)
                    if (curChance < chance) {
                        bonus = bonuses[key];
                        break;
                    }
                this.locals.canUse = true;
                this.locals.text.setText(bonus.letter);
                this.locals.logic = bonus.logic;
                this.locals.platform = engine.findByTag(OwnTags.Platform);
                this.locals.destroy = () => {
                    this.locals.canUse = false;
                    engine.coroutine(250, t => {
                        this.locals.text.scale = this.scale = 1 - engine.math.easeInOut(t);
                    }, () => {
                        this.destroy();
                        this.locals.text.destroy();
                    });
                }
            });
            prefab.onUpdate = function () {
                this.locals.setPos(this.x, this.y + engine.utils.dt * bonusSpeed);
                if (this.y > engine.height + this.height) {
                    this.destroy();
                }
                if (this.locals.canUse) {
                    if (!this.locals.platform.locals.balls || !this.locals.platform.locals.bricks)
                        return this.locals.destroy();
                    if (this.y > platformY + ballOffset) {
                        if (this.y >= platformY - ballOffset) {
                            this.locals.canUse = false;
                            return;
                        }
                        if (Math.abs(this.x - this.locals.platform.x) * 2 <= this.locals.platform.width) {
                            engine.playSound(Sounds.Bonus);
                            this.locals.logic();
                            this.locals.destroy();
                        }
                    }
                }
            };
        }),
        activeBallPrefab = engine.prefab(ballModelPrefab.clone(), prefab => {
            engine.setBorder('top', edgeY);
            engine.setBorder('bottom', platformY);
            prefab.tag = OwnTags.Ball;
            prefab.onStart = engine.override(prefab.onStart, function (_super) {
                _super();
                this.locals.dir = { x: 0, y: 0 };
                this.locals.dead = false;
            });
            prefab.onUpdate = function () {
                if (!inGame && !this.locals.dead) return;
                const speed = this.locals.platform.locals.speed * engine.utils.dt;
                let ox = this.locals.dir.x * speed,
                    oy = this.locals.dir.y * speed;

                if (!this.locals.dead && !this.locals.platform.locals.bricks) {
                    this.locals.platform.locals.decBalls();
                    this.locals.dead = true;
                }

                if (this.locals.dead) {
                    this.locals.setPos(this.x + ox, this.y + oy);
                    if (this.y < edgeY || this.y > engine.height + this.height) {
                        this.destroy();
                        this.locals.text.destroy();
                    }
                    return;
                }

                const coll = engine.checkCollisionDumbcast(this, [OwnTags.Brick, DefaultTags.Border], [ox, oy]);

                if (!coll) {
                    this.locals.setPos(this.x + ox, this.y + oy);
                    return;
                }

                let collide = 0;
                let changeDir = true;

                switch (coll.at) {
                    case "top":
                        if (this.locals.dir.y < 0)
                            collide = 3;
                        break;
                    case "bottom":
                        if (this.locals.dir.y > 0) {
                            if (coll.tag == DefaultTags.Border) {
                                const relX = (this.x +
                                    this.locals.dir.x * Math.abs((this.y - coll.atCoord) / this.locals.dir.y)
                                    - this.locals.platform.x) * 2 / this.locals.platform.width;

                                if (Math.abs(relX) > 1) {
                                    this.locals.dead = true;
                                    this.locals.platform.locals.decBalls();
                                    return;
                                }

                                const angle = relX * Math.PI / 3; // [-60, 60];

                                this.locals.dir = {
                                    x: Math.sin(angle),
                                    y: -Math.cos(angle)
                                }

                                changeDir = false;
                            }
                            collide = 1;
                        }
                        break;
                    case "left":
                        if (this.locals.dir.x == 0) {
                            collide = this.locals.dir.y > 0 ? 1 : 3;
                            coll.atCoord = this.y + this.locals.dir.y;
                        }
                        else if (this.locals.dir.x < 0)
                            collide = 4;
                        break;
                    case "right":
                        if (this.locals.dir.x == 0) {
                            collide = this.locals.dir.y > 0 ? 1 : 3;
                            coll.atCoord = this.y + this.locals.dir.y;
                        }
                        else if (this.locals.dir.x > 0)
                            collide = 2;
                        break;
                }

                if (collide) {
                    engine.playSound(Sounds.Ball);
                    if (coll.tag == OwnTags.Brick)
                        coll.other.locals.hit();
                    if (collide % 2) {
                        if (changeDir)
                            this.locals.dir.y *= -1;
                        const newOy = coll.atCoord - this.y;
                        ox *= newOy / oy;
                        oy = newOy + collide - 2;
                    }
                    else {
                        this.locals.dir.x *= -1;
                        const newOx = coll.atCoord - this.x;
                        oy *= newOx / ox;
                        ox = newOx + collide - 3;
                    }

                }

                this.locals.setPos(this.x + ox, this.y + oy);
            };
        }),
        uiBorderPrefab = engine.prefab(engine.createGeometry(engine.width, engine.height), prefab => {
            const r = ballTextPrefab.size / 2;
            prefab.line(0, edgeY + r, 0, engine.height, false);
            prefab.line(engine.width, edgeY + r, engine.width, engine.height, false);
            prefab.line(r, edgeY, engine.width - r, edgeY, false);
            prefab.arc(180, 270, r, edgeY + r, r, false, false);
            prefab.arc(270, 360, engine.width - r, edgeY + r, r, false, false);

            prefab.onStart = function () {
                this.x = engine.width / 2;
                this.y = engine.height / 2;
                this.visible = secondOrHigherAttempt;
            };
        }),
        brickPrefab = engine.prefab(engine.createPixelArt(50, 25), prefab => {
            prefab.loadArt(
                "                                                                \n" +
                "      ####################################################      \n" +
                "    ########################################################    \n" +
                "   ##########################################################   \n" +
                "  ############################################################  \n" +
                "  ############################################################  \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                "  ############################################################  \n" +
                "  ############################################################  \n" +
                "   ##########################################################   \n" +
                "    ########################################################    \n" +
                "      ####################################################      \n" +
                "                                                                \n"
            ).addFrame().loadArt(
                "                                                                \n" +
                "      ####################################################      \n" +
                "    ########################################################    \n" +
                "   ##########################################################   \n" +
                "  ############################################################  \n" +
                "  ############################################################  \n" +
                " #############################       ########################## \n" +
                " ############################# #### ########################### \n" +
                " ############################# ###  ########################### \n" +
                " ############################# ### ############################ \n" +
                " ############################  ##  ############################ \n" +
                " ############################ ### ############################# \n" +
                " ############################ ##  ############################# \n" +
                " ############################ ## ############################## \n" +
                " ###########################  ## ############################## \n" +
                " ########################### ####   ########################### \n" +
                " ###########################    ## ############################ \n" +
                " ############################### # ############################ \n" +
                " ###############################  ############################# \n" +
                " ###############################  ############################# \n" +
                " ##############################  ############################## \n" +
                " ##############################  ############################## \n" +
                " ############################## ############################### \n" +
                " #############################  ############################### \n" +
                " ############################# ################################ \n" +
                " ############################# ################################ \n" +
                "  ############################################################  \n" +
                "  ############################################################  \n" +
                "   ##########################################################   \n" +
                "    ########################################################    \n" +
                "      ####################################################      \n" +
                "                                                                \n"
            ).addFrame().loadArt(
                "                                                                \n" +
                "      #######       #######        #####      ############      \n" +
                "    ############   ##########    #########   ###############    \n" +
                "   ############### ########### ############ #################   \n" +
                "  ################# ######### ############ # #################  \n" +
                "  ######################################## ###################  \n" +
                " #############################       ########################## \n" +
                " #############################      ########################### \n" +
                " #############################      ########################### \n" +
                " #############################     ############################ \n" +
                " ############################      ############################ \n" +
                " ############################     ############################# \n" +
                " ############################     ############################  \n" +
                " ############################    #############################  \n" +
                "  #  #######################     ############################   \n" +
                "    # ######################        ########################  # \n" +
                "   #########################       ############################ \n" +
                "  ##############################   ############################ \n" +
                " ###############################  ############################# \n" +
                " ###############################  ############################# \n" +
                " ##############################  ############################## \n" +
                " ##############################  ############################   \n" +
                " ############################## ##############################  \n" +
                " #############################  ############################### \n" +
                " ############################# ################################ \n" +
                " ############################# ################################ \n" +
                "  ###################################### #####################  \n" +
                "  #########################  ########### ##### ###############  \n" +
                "   ################## #######  ######## ####### #############   \n" +
                "    ######## ####### ######      #####    ####   ###########    \n" +
                "      ##### #######   ####        ###      #       #######      \n" +
                "                                                                \n"
            ).addFrame().loadArt(
                "                                                                \n" +
                "      ####################################################      \n" +
                "    ########################################################    \n" +
                "   ##########################################################   \n" +
                "  ####   ##############################################   ####  \n" +
                "  ### ### ############################################ ### ###  \n" +
                " ### ## ## ########################################## ## ## ### \n" +
                " ### #   # ########################################## #   # ### \n" +
                " ### ## ## ########################################## ## ## ### \n" +
                " #### ### ############################################ ### #### \n" +
                " #####   ##############################################   ##### \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " #####   ##############################################   ##### \n" +
                " #### ### ############################################ ### #### \n" +
                " ### ## ## ########################################## ## ## ### \n" +
                " ### #   # ########################################## #   # ### \n" +
                " ### ## ## ########################################## ## ## ### \n" +
                "  ### ### ############################################ ### ###  \n" +
                "  ####   ##############################################   ####  \n" +
                "   ##########################################################   \n" +
                "    ########################################################    \n" +
                "      ####################################################      \n" +
                "                                                                \n"
            ).addFrame().loadArt(
                "                                                                \n" +
                "      #######       #######        #####      ############      \n" +
                "    ############   ##########    #########   ###############    \n" +
                "   ############### ########### ############ #################   \n" +
                "  ####   ########## ######### ############ # ##########   ####  \n" +
                "  ####### ################### ############ ########### ### ###  \n" +
                " ###### ## ########################################## ##### ### \n" +
                " ### ##  # ########################################## ### # ### \n" +
                " ### ## ## ########################################## ## ## ### \n" +
                " #### ### ############################################ ### #### \n" +
                " #####   ##############################################   ##### \n" +
                " ############################################################## \n" +
                " #############################################################  \n" +
                " #############################################################  \n" +
                "  #  ########################################################   \n" +
                "    # ######################################################  # \n" +
                "   ############################################################ \n" +
                "  ############################################################# \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ############################################################## \n" +
                " ######################################################   ###   \n" +
                " #### ### ################################################ ###  \n" +
                " ### ## ## ############################################# ## ### \n" +
                " ### #   # ########################################## #   # ### \n" +
                " ### ## ## ########################################## ## ## ### \n" +
                "  ### ### ############################## ############# ### ###  \n" +
                "  ####   ##################  ########### ##### ########   ####  \n" +
                "   ################## #######  ######## ####### #############   \n" +
                "    ######## ####### ######      #####    ####   ###########    \n" +
                "      ##### #######   ####        ###      #       #######      \n" +
                "                                                                \n"
            ).addFrame().loadArt(
                "                                                                \n" +
                "      #######       #######        ###           #########      \n" +
                "    ############    #########    #######        ############    \n" +
                "   ##############  ###########  #########     ###############   \n" +
                "  ################ ###########  ###########  ###########  ####  \n" +
                "  ####### ######### ########### ############  ############ ###  \n" +
                " ######### ######## ###########  ########## # ############# ### \n" +
                " ### ### # ######### ########## # ######## ### ###### ##### ### \n" +
                " ### ## ## ########## ######## ## ######## ########## ##### ### \n" +
                " #### ### ############ ####### ####################### ### #### \n" +
                " #####   ############# ###### #########################   ####  \n" +
                " #################### # #### #################################  \n" +
                " #################### ##  ## ################################   \n" +
                "  #### ###################  #################################   \n" +
                "   ## ###########  ######### ################################   \n" +
                "       ######### ############ ######## ################# ###    \n" +
                "    ## ######   ############# ######## ### ############## #  #  \n" +
                "   #### ##   ########################## ## ##### #######   #### \n" +
                "   #####  ############################# # ###### #####  ####### \n" +
                "  ######## ##################### ####### ####### ############   \n" +
                " ########## ##################### #  #### ##### ############    \n" +
                " ################################# ###### ##### #######   ###   \n" +
                " ######## ####################### ######## ### ########### ###  \n" +
                " ######### ######### ############ #########  # ############ ### \n" +
                " ####### # ######### ############ ##### ## ## ##########  # ### \n" +
                " ### ## ## ########## ########## ###### # ## ########### ## ### \n" +
                "  ### ### #### ###### # ######## ####### ### ############# ###  \n" +
                "  ####   #### #######  #######  ######## ##   ##########  ####  \n" +
                "   ######## # ####### #######   ####### ##      #############   \n" +
                "    ######## #######  #####      #####            ##########    \n" +
                "      ##### ######     ###        ###              #######      \n" +
                "                                                                \n"
            );

            prefab.onStart = function () {
                this.locals.init = (x, y, type) => {
                    this.tag = OwnTags.BrickInactive;
                    this.scale = 0;
                    engine.wait(engine.math.randInt(7) * 100, () => {
                        engine.coroutine(250, t => {
                            this.scale = engine.math.easeInOut(t);
                        }, () => {
                            this.scale = 1;
                            this.tag = OwnTags.Brick;
                        })
                    });

                    this.x = (x + .5) * this.width;
                    this.y = edgeY + (y + 1.5) * this.height;
                    this.setFrame(bricks[type][0])
                    this.locals.health = bricks[type][1];
                    this.locals.score = bricks[type][1] * bricks[type][1] * scoreMp;
                    this.locals.platform = engine.findByTag(OwnTags.Platform);
                    this.locals.platform.locals.incBrick();
                    this.locals.hit = () => {
                        if (--this.locals.health) {
                            this.nextFrame();
                            return;
                        }
                        engine.playSound(Sounds.Brick);
                        this.locals.platform.locals.decBrick(this.locals.score);
                        this.tag = OwnTags.BrickInactive;
                        switch (type) {
                            case BrickTypes.Bonus:
                                const bonus = engine.instantiate(bonusPrefab);
                                bonus.locals.setPos(this.x, this.y);
                                break;
                        }
                        engine.coroutine(500, t => {
                            this.scale = 1 - engine.math.easeInOut(t);
                        }, () => this.destroy());
                    };
                };

            };
        }),
        // fieldSize = {
        //     x: Math.round(engine.width / brickPrefab.width),
        //     y: Math.round(engine.height / brickPrefab.height * .5),
        // },
        dinoPrefab = engine.prefab(engine.createPixelArt(75, 50), prefab => {
            prefab.tag = OwnTags.Dino;

            loadDinoSprites(prefab);

            prefab.onStart = function () {
                this.x = 47.5;
                this.y = 50;

                this.locals.lives = [];
                for (let i = 0; i < livesMax; i++) {
                    const ball = engine.instantiate(ballModelPrefab);
                    ball.visible = ball.locals.text.visible = false;
                    ball.locals.setPos(this.x + livesOffsetX *
                        (i + 1 - livesMax), this.y + livesOffsetY);
                    this.locals.lives.push(ball);
                }

                this.locals.setLives = (lives) => {
                    const startX = this.locals.lives[livesMax - 1].x,
                        endX = this.x + lives * livesOffsetX,
                        y = this.y + livesOffsetY;
                    engine.coroutine(startX > endX ? 500 : 1000, t => {
                        let x = engine.math.lerp(startX, endX, t);
                        for (let i = livesMax - 1; i >= 0; i--) {
                            this.locals.lives[i].locals.setPos(x, y);
                            this.locals.lives[i].locals.text.visible =
                                this.locals.lives[i].visible = x > this.x + livesEatOffset;

                            x -= livesOffsetX;
                        }
                    });
                }
            };
        }),
        helpTextPrefab = engine.prefab(engine.createText(), prefab => {
            prefab.setText('Повторите попытку позже..\nИли попробуйте тыкнуть прямо тут');
            prefab.setSize(14);
        }),
        scoreTextPrefab = engine.prefab(engine.createText(), prefab => {

            prefab.onStart = function () {
                this.y = edgeY / 2;
                this.scale = secondOrHigherAttempt ? 1 : 0;
                this.locals.active = secondOrHigherAttempt;
                this.locals.variation = 0;
            };

            prefab.onUpdate = function () {
                if (this.locals.active) {
                    const { score, stage, bestScore, cheater } = this.locals.platform.locals;
                    this.align = this.locals.variation ? 'center' : 'right';
                    this.setText(this.locals.variation ?
                        `${score} очков на уровне ${stage}\n${cheater ? '(правда, я использовал чит)' : ''}\nА ты побьешь мой рекорд` +
                        (location.host ? ' на\n' + location.host + location.pathname : '\nВ арканоиде Дино') :
                        `Уровень: ${stage}  Счёт: ${score}\nЛучший счёт: ${bestScore}`);
                    if (this.locals.variation)
                        return;
                    this.x = engine.width - 10 - this.width / 2;
                }
                else {
                    if (!inGame && !canStart)
                        return;

                    this.locals.active = true;

                    engine.coroutine(250, t => {
                        this.scale = engine.math.easeInOut(t);
                    }, () => this.scale = 1);
                }
            };
        }),
        selfiFramePrefab = engine.prefab(engine.createGeometry(1, 1), prefab => {
            prefab.line(0, 0, 1, 0);
            prefab.line(0, 0, 0, 1);
            prefab.line(0, 1, 1, 1);
            prefab.line(1, 0, 1, 1);
        }),
        levelUpPrefab = engine.prefab(engine.createGeometry(50, engine.height - edgeY), prefab => {
            const textPrefab = engine.createText();
            prefab.line(0, 1, 1, 0);
            prefab.onStart = function () {
                this.x = engine.width / 2;
                this.y = edgeY + (engine.height - edgeY) / 2;
                // textPrefab.align = 'center';
                textPrefab.size = 15;

                const left = this.locals.left = engine.instantiate(textPrefab),
                    leftHelp = this.locals.leftHelp = engine.instantiate(textPrefab),
                    center = this.locals.center = engine.instantiate(textPrefab),
                    right = this.locals.right = engine.instantiate(textPrefab),
                    rightHelp = this.locals.rightHelp = engine.instantiate(textPrefab);

                left.setText('ВСЁ');
                leftHelp.setText('Перейти на следующий уровень:\nВ случае проигрыша, рекорд\nНе будет сохранен\nВы сможете набить больше очков,\nНо скорость шарика вырастет');
                leftHelp.setSize(14);

                right.setText('НИЧЕГО');
                rightHelp.setText('Закончить игру:\nВы сохраните свой рекорд\nИ даже сможете сделать\nСелфи с рекордом и Дино\nНо на этом всё: Конец игры');
                rightHelp.setSize(14);
                rightHelp.align = 'right';

                center.setText('ИЛИ');

                center.x = engine.width / 2;
                center.y = engine.height / 2;
                leftHelp.y = center.y + 100 + leftHelp.height / 2;
                rightHelp.y = center.y + 100 + rightHelp.height / 2;

                this.locals.pos = 0.5;
                this.locals.active = this.locals.canTap = false;
                this.locals.lastSelect = -1;

                this.locals.show = () => {
                    if (!engine.mouse.isTouch)
                        this.locals.pos = this.locals.lastSelect = (engine.mouse.x < engine.width / 2) ? 0 : 1;
                    this.locals.active = true;
                    this.locals.canTap = false;
                    engine.coroutine(500, t =>
                        this.locals.setScale(engine.math.easeInOut(t)),
                        () => this.locals.setScale(1));
                }

                this.locals.setScale = (t) => {
                    this.scale
                        = this.locals.left.scale
                        = this.locals.leftHelp.scale
                        = this.locals.right.scale
                        = this.locals.rightHelp.scale
                        = this.locals.center.scale
                        = t;
                    if (this.locals.platform)
                        this.locals.platform.scale = 1 - t;
                }

                this.locals.setScale(0);
            };

            prefab.onUpdate = function () {
                if (!this.locals.active) return;
                if (!this.locals.canTap && !engine.mouse.inTouch)
                    this.locals.canTap = true;
                const select = (engine.mouse.x < engine.width / 2) ? 0 : 1;
                if (!engine.mouse.isTouch) {
                    if (this.locals.lastSelect != select) {
                        this.locals.lastSelect = select;
                        engine.playSound(Sounds.Select);
                    }

                    this.locals.pos = engine.math.lerp(
                        this.locals.pos,
                        select,
                        engine.utils.dt * 10
                    );
                }

                const pos = this.locals.pos;

                const x = engine.width / 2 + pos * 6,
                    y = this.locals.center.y;

                this.locals.center.x = x;

                this.locals.left.setSize(30 - 10 * pos)
                this.locals.right.setSize(20 + 10 * pos)

                this.locals.left.x = x - 10 - this.locals.left.computeWidth() / 2;
                this.locals.right.x = x + 10 + this.locals.right.computeWidth() / 2;

                this.locals.leftHelp.x = x - engine.width / 4;
                this.locals.rightHelp.x = x + engine.width / 4;

                this.locals.left.y = y - this.locals.left.computeHeight();
                this.locals.right.y = y + this.locals.right.computeHeight();

                if (this.locals.canTap && engine.mouse.inTouch) {
                    const platform = this.locals.platform;
                    this.locals.active = false;
                    platform.x = engine.width / 2;
                    platform.locals.spawnFirstBall();

                    const ball = platform.locals.firstBall;
                    ball.scale = ball.locals.text.scale = 0;

                    engine.coroutine(500, t => {
                        const easeT = engine.math.easeInOut(t);
                        this.locals.setScale(1 - easeT);
                        ball.scale = ball.locals.text.scale = easeT;
                    }, () => {
                        this.locals.setScale(0);
                        ball.scale = ball.locals.text.scale = 1;
                        if (select) {
                            if (platform.locals.bestScore < platform.locals.score) {
                                platform.locals.bestScore = platform.locals.score;
                                engine.save(Storage.BestScore, platform.locals.bestScore);
                            }

                            platform.locals.dino.animate(...dinoAnimations.GAMEOVER);
                            platform.locals.scoreText.locals.variation = 1;

                            const
                                platformStartX = platform.x,
                                platformStartY = platform.y,
                                platformEndX = platformStartX - platform.width,
                                platformEndY = engine.height / 2 + platform.width * 0.8 - platform.height,
                                scoreTextStartX = platform.locals.scoreText.x,
                                scoreTextStartY = platform.locals.scoreText.y,
                                scoreTextEndX = platformStartX + platform.width / 2,
                                scoreTextEndY = (engine.height + platform.locals.scoreText.height + platform.height) / 2,
                                dinoStartX = platform.locals.dino.x,
                                dinoStartY = platform.locals.dino.y,
                                dinoEndX = platformEndX - platform.width / 4,
                                dinoEndY = platformEndY - (platform.height + platform.locals.dino.height) / 2;

                            engine.coroutine(1000, t => {
                                const easeT = engine.math.easeInOut(t);

                                platform.locals.scoreText.x = engine.math.lerp(scoreTextStartX, scoreTextEndX, easeT);
                                platform.locals.scoreText.y = engine.math.lerp(scoreTextStartY, scoreTextEndY, easeT);
                                platform.locals.dino.x = engine.math.lerp(dinoStartX, dinoEndX, easeT);
                                platform.locals.dino.y = engine.math.lerp(dinoStartY, dinoEndY, easeT);
                                platform.x = engine.math.lerp(platformStartX, platformEndX, easeT);
                                platform.y = engine.math.lerp(platformStartY, platformEndY, easeT);
                                ball.locals.setPos(platform.x, platform.y + ballOffset);
                            }, () => {
                                platform.locals.scoreText.x = scoreTextEndX;
                                platform.locals.scoreText.y = scoreTextEndY;
                                platform.locals.dino.x = dinoEndX;
                                platform.locals.dino.y = dinoEndY;
                                platform.x = platformEndX;
                                platform.y = platformEndY;
                                ball.locals.setPos(platformEndX, platformEndY + ballOffset);

                                engine.wait(500, () => {
                                    const frame = engine.instantiate(selfiFramePrefab);
                                    frame.x = engine.width / 2;
                                    frame.y = engine.height / 2;
                                    frame.width = platform.width * 3.2;
                                    frame.height = platform.width * 1.6;

                                    const restart = engine.instantiate(textPrefab),
                                        save = engine.instantiate(textPrefab);

                                    restart.setSize(30);
                                    save.setSize(30);
                                    restart.setText('РЕСТАРТ');
                                    save.setText('СОХРАНИТЬ');
                                    restart.x = frame.x + frame.width / 4;
                                    save.x = frame.x - frame.width / 4;
                                    restart.y = save.y = frame.y + frame.height / 2 + 50;

                                    save.onUpdate = function () {
                                        if (this.isClicked()) {
                                            frame.screenshot();
                                        }
                                    }
                                    restart.onUpdate = function () {
                                        if (this.isClicked()) {
                                            engine.restart();
                                        }
                                    }
                                });
                            });

                            return;
                        }

                        platform.locals.setUpLvl();
                    })
                }
            }
        }),
        platformPrefab = engine.prefab(engine.createText(), prefab => {
            function setX(x) {
                const edge = this.width / 2;
                this.x = engine.math.clamp(x, edge, engine.width - edge);
            }

            prefab.tag = OwnTags.Platform;
            prefab.setText('Нет интернета');
            prefab.setSize(20);
            prefab.onStart = function () {
                this.locals.cheater = false;

                this.x = this.width / 2 + 10;
                this.y = secondOrHigherAttempt ? platformY : 100;
                this.locals.immunity = false;
                this.locals.tapToRestart = false;
                this.locals.speed = startSpeed - speedToAdd;
                this.locals.stage = this.locals.balls = this.locals.score = this.locals.bricks = 0;
                this.locals.bestScore = engine.load(Storage.BestScore, 0);
                this.locals.lives = livesMax;

                this.locals.setUpLvl = () => {
                    this.locals.speed += speedToAdd;
                    const stage = this.locals.stage++;
                    const level = Levels[stage > Levels.length ? Levels.length - 1 : stage];


                    this.locals.dino.animate(...dinoAnimations.FASTSWING);
                    engine.playSound(Sounds.LvlUp);
                    let x = 0, y = 0;
                    for (const brick of level) {
                        let brickType = BrickTypes.Normal;
                        switch (brick) {
                            case '\n':
                                x = 0;
                                y++;
                                continue;
                            case ' ':
                                x++;
                                continue;
                            case '+':
                                brickType = BrickTypes.Bonus;
                                break;
                            case '@':
                                brickType = BrickTypes.Metal;
                                break;
                        }

                        engine.instantiate(brickPrefab).locals.init(x++, y, brickType);
                    }

                    engine.coroutine(1000, () => {
                        setX.call(this, engine.mouse.x);
                        this.locals.firstBall.locals.setPos(this.x, this.y + ballOffset);
                    }, () => {
                        this.locals.dino.animate(...dinoAnimations.IDLE);
                        canStart = true;
                    });
                }
                this.locals.incBrick = () => {
                    this.locals.bricks++;
                }
                this.locals.decBrick = (score) => {
                    this.locals.score += score;
                    if (--this.locals.bricks) return;

                    engine.playSound(Sounds.LvlUp);
                    this.locals.levelUp.locals.show();
                }
                this.locals.decBalls = () => {
                    if (--this.locals.balls) return;
                    if (!this.locals.bricks) {
                        return;
                    }
                    if (this.locals.immunity) return;
                    this.locals.immunity = true;
                    engine.playSound(Sounds.Hit);
                    this.locals.dino.animate(...dinoAnimations.SWING);
                    this.locals.dino.locals.setLives(--this.locals.lives)
                    engine.coroutine(1000, t => {
                        this.visible = Math.round(t * 10) % 2 == 0;
                    }, () => {
                        this.locals.immunity = false;
                        if (this.locals.lives) {
                            this.locals.spawnFirstBall();
                            canStart = true;
                            this.locals.dino.animate(...dinoAnimations.IDLE);
                        } else {
                            this.locals.dino.animate(...dinoAnimations.GAMEOVER);
                            const lastBricks = engine.findAllByTag(OwnTags.Brick);
                            engine.coroutine(
                                1000 * (dinoAnimations.GAMEOVER[1] - dinoAnimations.GAMEOVER[0] + 1) / dinoAnimations.GAMEOVER[2], t => {
                                    const scale = 1 - engine.math.easeInOut(t);
                                    lastBricks.forEach(x => x.scale = scale);
                                }, () => {
                                    this.locals.tapToRestart = true;
                                }
                            )
                        }
                        this.visible = true;

                    });
                }
                this.locals.spawnBall = (pos, dir, firstBall = false) => {
                    if ((!firstBall && !this.locals.balls) || this.locals.balls == ballsMax)
                        return;
                    this.locals.balls++;
                    const ball = engine.instantiate(activeBallPrefab);
                    ball.locals.setPos(...pos);
                    ball.locals.dir = {
                        x: dir[0],
                        y: dir[1],
                    }
                    ball.locals.platform = this;

                    if (firstBall)
                        this.locals.firstBall = ball;
                }
                this.locals.spawnFirstBall = () => {
                    inGame = false;
                    this.locals.spawnBall(
                        secondOrHigherAttempt ? [this.x, this.y + ballOffset] : [this.width + 20, this.y],
                        [0, -1], true
                    )
                }

                this.locals.dino = engine.instantiate(dinoPrefab);

                this.locals.uiBorder = engine.instantiate(uiBorderPrefab);

                this.locals.levelUp = engine.instantiate(levelUpPrefab);
                this.locals.levelUp.locals.platform = this;

                this.locals.spawnFirstBall();

                if (secondOrHigherAttempt) {
                    canStart = false;
                    inGame = false;
                    this.locals.dino.locals.setLives(livesMax);
                    this.locals.setUpLvl();
                }
                else {
                    const helpText = this.locals.helpText = engine.instantiate(helpTextPrefab);
                    helpText.y = this.y + this.height / 2 + helpText.height / 2 + 7;
                    helpText.x = helpText.width / 2 + 10;
                }

                this.locals.scoreText = engine.instantiate(scoreTextPrefab);
                this.locals.scoreText.locals.platform = this;
            };
            prefab.onUpdate = function () {
                if (this.locals.tapToRestart && engine.mouse.inTouch) {
                    engine.restart();
                }
                if (!secondOrHigherAttempt && engine.mouse.inTouch) {
                    secondOrHigherAttempt = true;
                    const startY = this.y, startX = this.x, ballStartX = this.locals.firstBall.x, ballStartY = this.locals.firstBall.y;

                    this.locals.dino.locals.setLives(livesMax);
                    this.locals.dino.animate(...dinoAnimations.IDLE);
                    engine.coroutine(1000, t => {
                        const easeT = engine.math.easeInOut(t);
                        this.locals.helpText.scale = 1 - easeT;
                        this.y = engine.math.lerp(startY, platformY, easeT)
                        setX.call(this, engine.math.lerp(startX, engine.mouse.x, t));
                        this.locals.firstBall.locals.setPos(engine.math.lerp(ballStartX, this.x, easeT), engine.math.lerp(ballStartY, platformY + ballOffset, easeT));
                    }, () => {
                        this.locals.setUpLvl();
                        this.locals.uiBorder.visible = true;
                        this.locals.helpText.destroy();
                    });
                }

                if (canStart || inGame)
                    setX.call(this, engine.mouse.x);
                if (canStart) {
                    this.locals.firstBall.locals.setPos(this.x, this.y + ballOffset);
                    if (engine.mouse.inTouch) {
                        canStart = false;
                        inGame = true;
                    }
                }
            };
        });

    engine.keyPressed('KeyM', () => {
        const platform = engine.findByTag(OwnTags.Platform);
        if (!platform) return;
        platform.locals.cheater = true;
        bonuses.minigan.logic();
    });

    engine.onStart = () => {
        engine.instantiate(platformPrefab);
    }

    return engine;
}