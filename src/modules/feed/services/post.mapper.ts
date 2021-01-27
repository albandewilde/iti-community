import { MessageAudioElement, MessageElement, MessageImageElement, MessageTextElement, MessageVideoElement, MessageYoutubeElement, Post, PostData, PostMessage } from '../post.model';

export class PostMapper {
  map(data: PostData): Post {
    return {
      ...data,
      message: this.parseMessage(data.message)
    }
  }

  private parseText(msg: string): [string, MessageElement | null] {
    const pictureRegex = /http[s]?:\/\/.+\.(jpeg|jpg|png|gif)/gmi;
    const videoRegex = /http[s]?:\/\/.+\.(mp4|wmv|flv|avi|wav)/gmi;
    const audioRegex = /http[s]?:\/\/.+\.(mp3|ogg|wav)/gmi;
    const youtubeRegex = /(http[s]?:\/\/)?www\.(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi;
    const urlRegex = /(https|http)(:\/\/)(\w|\S)*/gm
    const mentionRegex = new RegExp('(?<=[^\w.-]|^)@([A-Za-z]+(?:\.\w+)*)$');      

    let msgElem: MessageElement | null = null
    let cnt = msg

    if (urlRegex.test(msg)) {
      cnt = `<a href=${msg}>${msg}</a>`
    }
    if(mentionRegex.test(msg)) {
      cnt = `<span class="user-mention">${msg}</span>`
    }

    if (pictureRegex.test(msg)) {
      msgElem = {
        type: 'image',
        url: msg.match(pictureRegex)![0]
      }
    } else if(videoRegex.test(msg)) {
      msgElem = {
        type: 'video',
        url: msg.match(videoRegex)![0]
      }
    } else if(audioRegex.test(msg)) {
      msgElem = {
        type: "audio",
        url: msg.match(audioRegex)![0],
      }
    } else if(youtubeRegex.test(msg)) {
      youtubeRegex.lastIndex = 0;
      msgElem = {
        type: "youtube",
        videoId: youtubeRegex.exec(msg)![2]
      }
    }

    return [cnt, msgElem]
  }

  private parseMessage(message: string): PostMessage {
    let attachements: MessageElement[] = []
    let msgText: MessageTextElement = {
      type: "text",
      content: ""
    }

    for (let word of message.split(" ")) {
      let [ctn, msgElem] = this.parseText(word)
      msgText.content += ctn + " "
      msgElem !== null? attachements.push(msgElem!) : null
    }

    return {
      text: msgText,
      attachements
    };
  }
}
