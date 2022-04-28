using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.DTO;
using Udemy.Extension;
using Udemy.Helpers;
using Udemy.Interface;
using Udemy.Models;

namespace Udemy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
            if (username == createMessageDto.RecipientUsername.ToLower()) 
            {
                return BadRequest("You Cannot send message to yourself");
            }

            var sender = await unitOfWork.UserRepository.GetUserByUSernameAsync(username);
            var recipient = await unitOfWork.UserRepository.GetUserByUSernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            unitOfWork.MessageRepository.AddMessage(message);

            if (await unitOfWork.Complete()) return Ok(mapper.Map<MessageDto>(message));

            return BadRequest("Faild to send message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await unitOfWork.MessageRepository.GetMessagesForUser(messageParams);
            Response.addPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

            return messages;
        }

        //[HttpGet("thread/{username}")]
        //public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        //{
        //    var currentUsername =  User.GetUsername();

        //    return Ok(await unitOfWork.MessageRepository.GetMessageThread(currentUsername, username));
        //}

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await unitOfWork.MessageRepository.GetMessage(id);

            if (message.Sender.UserName != username && message.Recipient.UserName != username) 
                return Unauthorized();

            if (message.Sender.UserName == username) message.SenderDeleted = true;
            if (message.Recipient.UserName == username) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                unitOfWork.MessageRepository.DeleteMessage(message);

            if (await unitOfWork.Complete()) return Ok();

            return BadRequest("Problem Deleting the message");
        }
    }
}
