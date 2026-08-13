const prisma = require("../lib/prisma");

// ==================================================
// PUBLIC: GET PUBLISHED MAGAZINES
// ==================================================

async function getPublishedMagazines(req, res) {
  try {
    const magazines = await prisma.magazineIssue.findMany({
      where: {
        publishedAt: {
          not: null
        }
      },

      orderBy: {
        publishedAt: "desc"
      },

      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        issueNumber: true,
        volume: true,
        coverUrl: true,
        publishedAt: true,
        createdAt: true
      }
    });

    return res.json({
      magazines
    });

  } catch (error) {
    console.error(
      "Get published magazines error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve magazines"
    });
  }
}


// ==================================================
// PUBLIC: GET ONE MAGAZINE
// ==================================================

async function getPublishedMagazine(req, res) {
  try {
    const { slug } = req.params;

    const magazine =
      await prisma.magazineIssue.findFirst({
        where: {
          slug,
          publishedAt: {
            not: null
          }
        },

        include: {
          pages: {
            orderBy: {
              position: "asc"
            },

            include: {
              article: {
                where: {
                  status: "PUBLISHED"
                },

                include: {
                  author: {
                    select: {
                      id: true,
                      username: true,
                      displayName: true,
                      avatarUrl: true
                    }
                  },

                  blocks: {
                    orderBy: {
                      position: "asc"
                    },

                    include: {
                      media: true
                    }
                  },

                  categories: {
                    include: {
                      category: true
                    }
                  },

                  tags: {
                    include: {
                      tag: true
                    }
                  },

                  quiz: {
                    include: {
                      questions: {
                        orderBy: {
                          position: "asc"
                        },

                        include: {
                          options: {
                            orderBy: {
                              position: "asc"
                            },

                            select: {
                              id: true,
                              text: true,
                              position: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

    if (!magazine) {
      return res.status(404).json({
        message:
          "Published magazine not found"
      });
    }

    return res.json({
      magazine
    });

  } catch (error) {
    console.error(
      "Get published magazine error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve magazine"
    });
  }
}


// ==================================================
// PUBLIC: GET MAGAZINE PAGES
// ==================================================

async function getPublishedMagazinePages(req, res) {
  try {
    const { slug } = req.params;

    const magazine =
      await prisma.magazineIssue.findFirst({
        where: {
          slug,
          publishedAt: {
            not: null
          }
        },

        select: {
          id: true,
          title: true,
          slug: true,
          issueNumber: true,
          volume: true,
          coverUrl: true,

          pages: {
            orderBy: {
              position: "asc"
            },

            include: {
              article: {
                where: {
                  status: "PUBLISHED"
                },

                include: {
                  blocks: {
                    orderBy: {
                      position: "asc"
                    },

                    include: {
                      media: true
                    }
                  }
                }
              }
            }
          }
        }
      });

    if (!magazine) {
      return res.status(404).json({
        message:
          "Published magazine not found"
      });
    }

    return res.json({
      magazine
    });

  } catch (error) {
    console.error(
      "Get magazine pages error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve magazine pages"
    });
  }
}


// ==================================================
// PUBLIC: GET ONE MAGAZINE PAGE
// ==================================================

async function getPublishedMagazinePage(req, res) {
  try {
    const {
      slug,
      position
    } = req.params;

    const pagePosition =
      Number(position);

    if (
      !Number.isInteger(pagePosition) ||
      pagePosition < 1
    ) {
      return res.status(400).json({
        message:
          "Page position must be a positive integer"
      });
    }

    const magazine =
      await prisma.magazineIssue.findFirst({
        where: {
          slug,
          publishedAt: {
            not: null
          }
        },

        select: {
          id: true,
          title: true,
          slug: true
        }
      });

    if (!magazine) {
      return res.status(404).json({
        message:
          "Published magazine not found"
      });
    }

    const page =
      await prisma.magazinePage.findFirst({
        where: {
          issueId: magazine.id,
          position: pagePosition
        },

        include: {
          article: {
            where: {
              status: "PUBLISHED"
            },

            include: {
              blocks: {
                orderBy: {
                  position: "asc"
                },

                include: {
                  media: true
                }
              }
            }
          }
        }
      });

    if (!page) {
      return res.status(404).json({
        message:
          "Magazine page not found"
      });
    }

    return res.json({
      magazine,
      page
    });

  } catch (error) {
    console.error(
      "Get magazine page error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve magazine page"
    });
  }
}


module.exports = {
  getPublishedMagazines,
  getPublishedMagazine,
  getPublishedMagazinePages,
  getPublishedMagazinePage
};